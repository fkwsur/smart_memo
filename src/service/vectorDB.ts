import { Repository } from '../repository';
import { Injectable } from '@nestjs/common';
import { Utils } from '../utils';
const { MilvusClient, DataType } = require('@zilliz/milvus2-sdk-node');
const { v4 } = require('uuid');
const axios = require('axios');
const {Ollama} = require('ollama');
const ollama = new Ollama();
global.XMLHttpRequest = require('xhr2')
var xhr = new XMLHttpRequest();

const milvusClient = new MilvusClient({
  address: "127.0.0.1:19530",
});

@Injectable()
export class VectorDB {
  constructor(
    private readonly repo: Repository,
    private readonly u: Utils,
  ) { }

  async CreateDB(): Promise<Error | any> {
    try {
      console.log("vector db test start")

      const createCol = await milvusClient.createCollection({
        collection_name: "chronicle_test2",
        fields: [
          {
            name: "id",
            data_type: DataType.VarChar,
            max_length: 36,
            is_primary_key: true,
          },
          {
            name: "vector",
            data_type: DataType.FloatVector,
            dim: 768,
          },
          {
            name: "ledger",
            data_type: DataType.VarChar,
            max_length: 1200,
          },
        ],
      });
      const createIndex = await milvusClient.createIndex({
        collection_name: "chronicle_test2",
        field_name: "vector",
        index_type: "IVF_FLAT",
        index_name: "test_idx",
        metric_type: "L2",
        params: { nlist: 4096 },
      });
      console.log("Create Index : ", createIndex);
      return true;
    } catch (error) {
      console.log("error : ", error)
      return;
    }
  }

  async Insert(data: string): Promise<Error | true> {
    try {
      await milvusClient.loadCollectionSync({
        collection_name: 'chronicle_test2',
      });
      console.log(data)
      console.log("???????")
      const response = await axios.post('http://127.0.0.1:5000/embedding', {
        data: data
      });
      console.log(response)
      try {
        await milvusClient.insert({
          collection_name: 'chronicle_test2',
          fields_data: [
            {
              vector: response.data.embedding,
              id: v4().toString(),
              ledger: data
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }

      await milvusClient.releaseCollection({
        collection_name: 'chronicle_test2',
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async Search(keyword: string): Promise<Error | any[]> {
    try {
      const collection = await milvusClient.loadCollectionSync({
        collection_name: "chronicle_test2",
      });
      console.log("load collection : ", collection);
      const response = await axios.post('http://127.0.0.1:5000/embedding', {
        data: keyword
      });
      let res = await milvusClient.search({
        collection_name: "chronicle_test2",
        vector: response.data.embedding,
        output_fields: ["ledger"],
        limit: 5,
      });
      return res;
    } catch (error) {
      throw error;
    }
  }
  async Ranking(): Promise<Error | any[]> {
    try {
      const collection = await milvusClient.loadCollectionSync({
        collection_name: "chronicle_test2",
      });
      console.log("load collection : ", collection);
      const response = await milvusClient.query({
        collection_name: 'chronicle_test2',
        output_fields: ['vector', 'ledger'],
        limit: 1000,
      });

      const memoRankings = [];
      for (let i = 0; i < response.data.length; i++) {
        const searchResults = await milvusClient.search({
          collection_name: 'chronicle_test2',
          vector: response.data[i].vector,
          output_fields: ['ledger'],
          limit: 10, 
          metric_type: 'L2',
        });

        // 여기에 llm 이 주제 이름 지어주는 항목 추가

        let group_arr = [];
        let subject = [];
        for(const rows of searchResults.results){
          if(rows.score < 170){
            group_arr.push(rows)
            subject.push(rows.ledger)
            response.data.forEach((k, index)=> {
              if(k.id === rows.id) {
                response.data.splice(index, 1);
              }
            });
          }
        }
        console.log(">>>>>>>",group_arr)
        const resp = await ollama.chat({
          model : "gemma2:latest",
          messages: [{
                  role : 'system', 
                  content : `이 배열안 값들을 가지고 한줄로 요약해줘. 그리고 제목만 대답하고 다른말은 하지마 : ${subject}`,
          }]
        });
        if(group_arr.length > 0){
          memoRankings.push({  title : resp.message.content, count : group_arr.length})
        }
      }
      const result = memoRankings.sort((a, b) => b.count - a.count);
    return result;
    } catch (error) {
      throw error;
    }
  }

}
