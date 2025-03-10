<?php

namespace App\Http\Controllers;



use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;

class UserController extends Controller
{

  protected $client;//client guzzle
  protected $baseUrl;


   public function __construct() {
   $this->client = new Client(); // Inicialize o cliente Guzzle
   $this->baseUrl = 'http://localhost:3000'; // Seu URL base
   }
  


    public function index(){
        $resoonse = $this->client->get('/users');
        $users = json_decode($response->getBody(), true);
        return view('users.index', compact('users'));
    }

    public function create(){
        return view('users.create');
    }
    public function store(Request $request){
        $this->client->post('/users', ['json' => $request->all()]);
        return redirect()->route('users.index');
    }

    public function show($id){
        $response = $this->client->get("/users/{$id}");
        $user = json_decode($response->getBody(), true);
        return view('user.show', compact('user'));
    }

    public function edit($id){
        $response = $this->client->get("/users/{$id}");
        $user = json_decode($response->getBody(), true);
        return view('users.edit', compact('user'));
    }
    public function update(Request $request, $id){
        $this->client->put("/users/{$id}", ['json' => $request->all()]);
        return redirect()->route('users.index');
    }

    public function destroy($id){
        $this->client->delete("/users/{$id}");
        return redirect()->route('users.index');
    }
                }
