@extends('layouts.app')
@section('content')

<h1>Criar Usuário</h1>
    <form action="{{ route('users.store') }}" method="POST">
        @csrf
        <label for="nome">Nome:</label>
        <input type="text" name="nome" id="nome" required>
        <br>
        <label for="dataNascimento">Data de Nascimento:</label>
        <input type="date" name="dataNascimento" id="dataNascimento" required>
        <br>
        <label for="email">Email:</label>
        <input type="email" name="email" id="email" required>
        <br>
        <label for="cpf">CPF:</label>
        <input type="text" name="cpf" id="cpf" required>
        <br>
        <label for="fone">Telefone:</label>
        <input type="text" name="fone" id="fone" required>
        <br>
        <label for="rua">Rua:</label>
        <input type="text" name="rua" id="rua" required>
        <br>
        <label for="cep">CEP:</label>
        <input type="text" name="cep" id="cep" required>
        <br>
        <label for="bairro">Bairro:</label>
        <input type="text" name="bairro" id="bairro" required>
        <br>
        <label for="numero">Número:</label>
        <input type="text" name="numero" id="numero" required>
        <br>
        <label for="cidade">Cidade:</label>
        <input type="text" name="cidade" id="cidade" required>
        <br>
        <label for="estado">Estado:</label>
        <input type="text" name="estado" id="estado" required>
        <br>
        <button type="submit">Create</button>
    </form>
@endsection
