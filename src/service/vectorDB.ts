import { Repository } from '../repository';
import { Injectable } from '@nestjs/common';
import { Utils } from '../utils';
const { MilvusClient, DataType } = require('@zilliz/milvus2-sdk-node');
const { v4 } = require('uuid');
const axios = require('axios');

const milvusClient = new MilvusClient({
  address: "localhost:19530",
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
        collection_name: "chronicle_test",
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
        collection_name: "chronicle_test",
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
        collection_name: 'chronicle_test',
      });
      const response = await axios.post('http://localhost:5000/embedding', {
        data: data
      });
      try {
        await milvusClient.insert({
          collection_name: 'chronicle_test',
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
        collection_name: 'chronicle_test',
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async Search(keyword: string): Promise<Error | any[]> {
    try {
      const collection = await milvusClient.loadCollectionSync({
        collection_name: "chronicle_test",
      });
      console.log("load collection : ", collection);
      const response = await axios.post('http://localhost:5000/embedding', {
        data: keyword
      });
      let res = await milvusClient.search({
        collection_name: "chronicle_test",
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
        collection_name: "chronicle_test",
      });
      console.log("load collection : ", collection);
      const response = await milvusClient.query({
        collection_name: 'chronicle_test',
        output_fields: ['vector', 'ledger'],
        limit: 1000,
      });

      const memoRankings = [];
      for (let i = 0; i < response.data.length; i++) {
        const searchResults = await milvusClient.search({
          collection_name: 'chronicle_test',
          vector: response.data[i].vector,
          output_fields: ['ledger'],
          limit: 10, 
          metric_type: 'L2',
        });

        // 여기에 llm 이 주제 이름 지어주는 항목 추가

        let group_arr = [];
        for(const rows of searchResults.results){
          console.log(rows.score)
          if(rows.score < 300){
            response.data.forEach((k, index)=> {
              if(k.id === rows.id) {
                response.data.splice(index, 1);
              }
            });
          }
        }
        if(group_arr.length > 0){
          memoRankings.push({  title : group_arr[0].ledger, count : group_arr.length})
        }
      }
    return memoRankings;
    } catch (error) {
      throw error;
    }
  }

}
