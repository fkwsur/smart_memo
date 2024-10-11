import { useEffect, useState } from 'react';
import "./App.css";
import axios from 'axios';

export const App = () => {
  const [todo, setTodo] = useState("");
  const [endDate, setEndDate] = useState("");
  const [todoData, setTodoData] = useState("");
  const [rankData, setRankData] = useState("");

  useEffect(() => {
    GetTodo();
    GetRank();
  }, [])

  const CreateTodo = async () => {
    try {
      await axios.post(
        "http://localhost:8081/api/v1/chronicle/create", {
        content: todo,
        end_date: endDate
      },
      ).then((res) => {
        console.log(res)
        if (res.data.error) {
          alert(res.data.error.text);
          return;
        }
        if (res.data.result == "success") {
          alert("등록 완료")
          setTodo("");
          setEndDate("");
          GetTodo();
        }
      }).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const Delete = async (id) => {
    try {
      await axios.post(
        "http://localhost:8081/api/v1/chronicle/delete", {
        id: id
      },
      ).then((res) => {
        console.log(res)
        if (res.data.error) {
          alert(res.data.error.text);
          return;
        }
        if (res.data.result == "success") {
          alert("삭제 완료")
          GetTodo();
        }
      }).catch((err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const GetRank = async () => {
    try {
      await axios.get("http://localhost:8081/api/v1/chronicle/ranking")
        .then((res) => {
          if (res.data.error) {
            alert(res.data.error.text);
            return;
          }
          if (res.data) {
            setRankData(res.data);
          }
        }).catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const GetTodo = async () => {
    try {
      await axios.get("http://localhost:8081/api/v1/chronicle/read")
        .then((res) => {
          if (res.data.error) {
            alert(res.data.error.text);
            return;
          }
          if (res.data) {
            setTodoData(res.data);
          }
        }).catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <div className="wrap">
        <div className="lnb">
          <h3>Task Rank</h3>
          {rankData ? rankData.map((k, i) => {
            return (
                <p><b>{i + 1}</b> : {k.title}</p>
            )
          }) : "데이터를 불러오고 있습니다"
          }
        </div>
        <div className="container">
          <h2 className="title">Chronicle Work</h2>
          <div className="add">
            <p>할일 : </p> <input type="text" maxlength='150' value={todo} onChange={(e) => setTodo(e.target.value)} />
            <p>종료일 : </p> <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button className="btn" onClick={CreateTodo}>추가</button>
          </div>
          {todoData ? todoData.map((k) => {
            return (
              <div className="content">
                <h4>{k.end_date.split("T")[0]}</h4>
                <button className='delete' onClick={() => Delete(k.id)} >삭제</button>
                <p>{k.content}</p>
              </div>
            )
          }) : ""
          }
        </div>
      </div>
    </div>
  );
}

export default App;
