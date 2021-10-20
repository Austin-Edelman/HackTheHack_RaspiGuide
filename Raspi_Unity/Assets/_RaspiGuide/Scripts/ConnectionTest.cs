using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using WebSocketSharp;

public class ConnectionTest : MonoBehaviour
{
    WebSocket ws;
    public string ServerURL = "ws://192.168.1.10:8080"; //change to your pi's local IP
    public string MessageToSend = "hello server!";

    void Start()
    {
        Debug.Log("attempting to connect");

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

        //sending as object/string so that the server can parse it as JSON
        ws.Send("{\"type\": \"msg\", \"msg\": \"" + MessageToSend + "\"}");
    }

    private void OnApplicationQuit()
    {
        ws.Close();
    }
}
