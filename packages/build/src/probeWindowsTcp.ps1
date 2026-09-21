$ErrorActionPreference = 'Stop'
netsh int ipv4 show dynamicport tcp
netsh int ipv4 show excludedportrange protocol=tcp
Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics;

public static class TcpPortProbe {
  public static object Run(bool randomize, bool dynamicServer, int count) {
    var listener = new TcpListener(IPAddress.Loopback, dynamicServer ? 0 : 30001);
    listener.Start(512);
    int port = ((IPEndPoint)listener.LocalEndpoint).Port;
    int accepted = 0;
    int serverErrors = 0;
    var server = Task.Run(() => {
      while (true) {
        Socket socket;
        try { socket = listener.AcceptSocket(); }
        catch (SocketException) { return; }
        catch (ObjectDisposedException) { return; }
        using (socket) {
          Interlocked.Increment(ref accepted);
          try {
            socket.Send(new byte[] { 7 });
            socket.Receive(new byte[1]);
          } catch (SocketException error) {
            if (error.SocketErrorCode != SocketError.ConnectionReset) Interlocked.Increment(ref serverErrors);
          }
        }
      }
    });
    var errors = new List<object>();
    var watch = Stopwatch.StartNew();
    for (int i = 0; i < count; i++) {
      using (var client = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp)) {
        client.LingerState = new LingerOption(true, 0);
        client.ReceiveTimeout = 5000;
        if (randomize) client.SetSocketOption(SocketOptionLevel.Socket, (SocketOptionName)0x3005, 1);
        try {
          client.Connect(IPAddress.Loopback, port);
          if (client.Receive(new byte[1]) != 1) throw new Exception("Missing server acknowledgement");
        } catch (SocketException error) {
          string local = "";
          try { local = client.LocalEndPoint == null ? "unbound" : client.LocalEndPoint.ToString(); } catch {}
          errors.Add(new { index = i, code = error.NativeErrorCode, local = local, remotePort = port });
        }
      }
    }
    listener.Stop();
    if (!server.Wait(10000)) throw new Exception("Server did not stop");
    return new { randomize, dynamicServer, port, count, accepted, serverErrors, elapsedMs = watch.ElapsedMilliseconds, errors };
  }
}
'@
$results = @()
foreach ($dynamicServer in @($false, $true)) {
  foreach ($randomize in @($false, $true)) {
    $result = [TcpPortProbe]::Run($randomize, $dynamicServer, 10000)
    $results += $result
    $result | ConvertTo-Json -Depth 6 -Compress
  }
}
New-Item -ItemType Directory -Force e2e-artifacts | Out-Null
$results | ConvertTo-Json -Depth 6 | Set-Content e2e-artifacts/tcp-port-probe.json
Get-NetTCPConnection | Group-Object State | Select-Object Count,Name | ConvertTo-Json | Set-Content e2e-artifacts/tcp-states.json
