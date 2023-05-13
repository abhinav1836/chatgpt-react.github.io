import { useState, useEffect } from "react";
import spinner from './Spinner.svg';

const App = () => {
  const [value, setValue] =useState(null);
  const [ message, setMessage] = useState(null);
  const [ previousChat, setpreviousChat ]= useState([]);
  const [ currentTitle, setCurrentTitle ]= useState(null);

  const createNewChat = () => {
      setMessage(null);
      setValue("");
      setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }
  const [loading, setLoading] = useState(false);
  
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      console.log(data);
      setLoading(true);

      // Simulating API request delay
      setTimeout(() => {
        // Perform API request
        // Once the request is completed, set loading to false
        setLoading(false);
      }, 2000);     

      if (data.choices && data.choices.length > 0) {  //*CHECKING IF DATA>CHOICES != 'NULL'
        setMessage(data.choices[0].message);
      } else {
        setMessage(null);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() =>{
    console.log(currentTitle, value, message);
    if(!currentTitle && value && message){     // * setting backup of previous chats
      setCurrentTitle(value);
    }
    if(currentTitle && value && message){
      setpreviousChat(previousChat => (
        [...previousChat, {
              title : currentTitle,
              role: "user",
              content:value
        },
        {     
              title: currentTitle,
              role: message.role,
              content: message.content,
        }
      ]
      ))
    }
  },[currentTitle,message, currentTitle])

  const currentChat = previousChat.filter(previousChat => previousChat.title === currentTitle);
  const uniqueTitle = Array.from(new Set(previousChat.map(previousChat => previousChat.title)));

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat} >+ New Chat</button>
        <ul className="history" >
          {uniqueTitle?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Abhi</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>Abhi GPT Clone</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input id="chat-input" placeholder="Send a message." value={value || ''} onChange={(e) => setValue(e.target.value)}/>
            {/* <div id="submit" onClick={getMessages}>➢</div> */}
            <div id="submit" onClick={getMessages}>
              {loading ? (
                <img src={spinner} alt="Loading spinner" />
              ) : (
                '➢'
              )}
            </div>
          </div>
          <p className="info">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae inventore soluta dicta?
          </p>
        </div>
        
      </section>
    </div>
  );
}

export default App;
