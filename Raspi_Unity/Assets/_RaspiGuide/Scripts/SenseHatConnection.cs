//using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using WebSocketSharp;

public class SenseHatConnection : MonoBehaviour
{
    WebSocket ws;
    public string ServerURL = "ws://192.168.1.10:8080"; //change to your pi's local IP
    //public string MessageToSend = "hello server!";
    bool _isConnected = false;

    public GameObject FrogPrefab;
    public GameObject CellPrefab;
    GameObject[,] _senseHatCells = new GameObject[8,8];
    public float CellSize = 1;
    GameObject _frog;
    public Material GreenMaterial;

    float _timer = 0f;
    public float HopRate = 1f;
    float _lastTime = 0f;
    Vector3 oldCell = Vector3.zero;
    Vector3 newCell = Vector3.zero;

    void Start()
    {
        Debug.Log("attempting to connect");

        ws = new WebSocket(ServerURL);
        ws.OnOpen += (sender, e) =>
        {
            Debug.Log("connected to server");
            _isConnected = true;
        };
        ws.OnMessage += (sender, e) =>
        {
            Debug.Log("message received: " + e.Data);
        };
        ws.Connect();
        //ws.Send("hello server!");

        //sending as object/string so that the server can parse it as JSON
        //ws.Send("{\"type\": \"msg\", \"msg\": \"" + MessageToSend + "\"}");

        for (int x = 0; x < 8; x++)
        {
            for (int z = 0; z < 8; z++)
            {
                Vector3 _cellPos = new Vector3(x * CellSize, -0.5f, z * CellSize);
                _senseHatCells[x, z] = Instantiate(CellPrefab, _cellPos, Quaternion.identity);
            }
        }

        _frog = Instantiate(FrogPrefab, _senseHatCells[0, 0].transform.position + new Vector3(0, 0.5f, 0), Quaternion.identity);
    }

    private void FixedUpdate()
    {
        if (_timer - _lastTime > HopRate && _isConnected)
        {
            //if it's time to hop, move the frog and send the server the new cell to light up
            _lastTime = _timer;
            int[] senseCell = MoveFrog(_frog.transform.position);
            SendCellToServer(senseCell);

        } else
        {
            //advance the timer
            _timer += Time.deltaTime;

            //update frog position
            //_frog.transform.position = Vector3.Lerp(oldCell, newCell, 1f - (_lastTime / _timer) );
        }
    }

    int[] MoveFrog(Vector3 currentCell)
    {
        int x = 0;
        int z = 0;
        bool validCell = false;

        while (!validCell)
        {
            Vector3 nextCell = currentCell;

            float randDir = Random.Range(0f, 4f);
            
            if (randDir < 1f)
            {
                //move forward
                nextCell += Vector3.forward;
            } else if (randDir < 2f)
            {
                //move right
                nextCell += Vector3.right;
            } else if (randDir < 3f)
            {
                //move back
                nextCell += Vector3.back;
            } else
            {
                //move left
                nextCell += Vector3.left;
            }

            //check to see if in bounds
            if (nextCell.x < 8f && nextCell.x >= 0f && nextCell.z < 8f && nextCell.z >= 0f)
            {
                //valid spot
                x = (int)nextCell.x;
                z = (int)nextCell.z; 

                validCell = true;

                //move the frog
                //oldCell = newCell;
                //newCell = nextCell;
                Quaternion lookDir = Quaternion.LookRotation((nextCell - _frog.transform.position).normalized);
                _frog.transform.rotation = Quaternion.RotateTowards(_frog.transform.rotation, lookDir, 1000f);
                _frog.transform.position = nextCell;

                //Debug.LogFormat("x: {0}\ny: {1}\nold: {2}\nnew: {3}", x, z, oldCell, newCell);
            }
        }

        int[] senseCell = new int[] { x, z };

        //change color of cube
        _senseHatCells[x, z].GetComponent<MeshRenderer>().material = GreenMaterial;

        return senseCell;
    }

    void SendCellToServer(int[] cell)
    {
        cell[1] = 7 - cell[1]; //flip b/c diff coordinate space on the sensehat
        ws.Send("{\"type\": \"led\", \"led\": [" + cell[0].ToString() + "," + cell[1].ToString() + "]}");
    }

    private void OnApplicationQuit()
    {
        ws.Close();
    }
}
