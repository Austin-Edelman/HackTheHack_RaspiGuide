using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//using NativeWebSocket;
using WebSocketSharp;

public class ConnectionTest : MonoBehaviour
{
    //WebSocket websocket;
    WebSocket ws;
    public string ServerURL = "ws://192.168.1.10:8080"; //change to your pi's local IP
    public string MessageToSend = "hello server!";
    void Start()
    {
        //websocket = new WebSocket(serverURL);

        Debug.Log("attempting to connect");

        //using (var ws = new WebSocket(serverURL))
        //{
        ws = new WebSocket(ServerURL);
        ws.OnOpen += (sender, e) =>
        {
            Debug.Log("connected to server");
        };
        ws.OnMessage += (sender, e) =>
        {
            Debug.Log("message received: " + e.Data);
        };
        ws.Connect();
            //ws.Send("hello server!");
        //ws.Send("{\"type\": \"msg\", \"msg\": \"hello json!\"}");
        ws.Send("{\"type\": \"msg\", \"msg\": \"" + MessageToSend + "\"}");

        //}
        /*
        websocket.OnOpen += () =>
        {
            Debug.Log("Connection open!");
        };

        websocket.OnError += (e) =>
        {
            Debug.Log("Error! " + e);
        };

        websocket.OnClose += (e) =>
        {
            Debug.Log("Connection closed!");
        };

        websocket.OnMessage += (bytes) =>
        {
            // Reading a plain text message
            var message = System.Text.Encoding.UTF8.GetString(bytes);
            Debug.Log("Received OnMessage! (" + bytes.Length + " bytes) " + message);
        };

        // Keep sending messages at every 0.3s
        InvokeRepeating("SendWebSocketMessage", 0.0f, 0.3f);

        await websocket.Connect();
        */
    }

    void Update()
    {
#if !UNITY_WEBGL || UNITY_EDITOR
        //websocket.DispatchMessageQueue();
#endif
    }
    /*
    async void SendWebSocketMessage()
    {
        if (ws.State == WebSocketState.Open)
        {
            // Sending bytes
            //await websocket.Send(new byte[] { 10, 20, 30 });
            await websocket.SendText(JsonUtility.ToJson(new string[] { "string", "hello there" }));
            

            // Sending plain text
            await websocket.SendText("plain text message");
        }
    }
    */

    private void OnApplicationQuit()
    {
        ws.Close();
    }
}
