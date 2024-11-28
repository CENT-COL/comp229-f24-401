import { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/reset.css';

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const WebSocketComponent = () => {
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [messages, setMessages] = useState([]);
    const [searchVal, setSearchVal] = useState('');
    const [client, setClient] = useState(null);

    useEffect(() => {
        const newClient = new W3CWebSocket('ws://localhost:3000');
        
        newClient.onopen = () => {
            console.log('WebSocket Client Connected');
        }

        newClient.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);

            if(dataFromServer.type === 'message'){
                setMessages((prevMessages) => [...prevMessages, {msg: dataFromServer.msg, user: dataFromServer.user}]);
            }
        };

        newClient.onclose = (event) => {
            console.log('Socket Closed Connection: ', event);

            if( event.code !== 1000 ){
                console.error('Socket Closed Error: ', event);
            }
        }

        newClient.onerror = (error) => {
            console.error('Socket Error: ', error);
        }

        setClient(newClient);

        return () => newClient.close();

    }, []);


    const onButtonClicked = (value) => {
        if(client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'message',
                msg: value,
                user: userName
            }));

            setSearchVal('');
        } else {
            console.log('WebSocket is not open: ', client ? client.readyState : 'No client instance');
        }
    }

    return (
        <div className="main" id='wrapper'>
        {isLoggedIn ? (
          <div>
            <div className="title">
              <Text id="main-heading" type="secondary" style={{ fontSize: '36px' }}>
                Websocket Chat: {userName}
              </Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages">
              {messages.map((message, index) => (
                <Card
                  key={index}
                  style={{ width: 300, margin: '16px 4px 0 4px', alignSelf: userName === message.user ? 'flex-end' : 'flex-start' }}
                  loading={false}
                >
                  <Meta
                    avatar={
                      <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                        {message.user[0].toUpperCase()}
                      </Avatar>
                    }
                    title={`${message.user}:`}
                    description={message.msg}
                  />
                </Card>
              ))}
            </div>
            <div className="bottom">
              <Search
                placeholder="input message and send"
                enterButton="Send"
                value={searchVal}
                size="large"
                onChange={(e) => setSearchVal(e.target.value)}
                onSearch={onButtonClicked}
              />
            </div>
          </div>
        ) : (
          <div style={{ padding: '200px 40px' }}>
            <Search
              placeholder="Enter Username"
              enterButton="Login"
              size="large"
              onSearch={(value) => {
                setIsLoggedIn(true);
                setUserName(value);
              }}
            />
          </div>
        )}
      </div>
    )
};

export default WebSocketComponent;