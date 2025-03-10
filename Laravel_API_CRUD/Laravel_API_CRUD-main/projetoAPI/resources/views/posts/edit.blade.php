@extends('layouts.app')
@section('content')

    <h1>Editar Usuário</h1>
    <form action="{{ route('users.update', $user['id']) }}" method="POST">
        @csrf
        @method('PUT')

        <div>
            <label for="nome">Nome:</label>
            <input type="text" name="nome" id="nome" value="{{ $user['nome'] }}" required>
        </div>

        <div>
            <label for="dataNascimento">Data de Nascimento:</label>
            <input type="date" name="dataNascimento" id="dataNascimento" value="{{ $user['dataNascimento'] }}" required>
        </div>

        <div>
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" value="{{ $user['email'] }}" required>
        </div>

        <div>
            <label for="cpf">CPF:</label>
            <input type="text" name="cpf" id="cpf" value="{{ $user['cpf'] }}" required>
        </div>

        <div>
            <label for="fone">Telefone:</label>
            <input type="text" name="fone" id="fone" value="{{ $user['fone'] }}" required>
        </div>

        <div>
            <label for="rua">Rua:</label>
            <input type="text" name="rua" id="rua" value="{{ $user['rua'] }}" required>
        </div>

        <div>
            <label for="cep">CEP:</label>
            <input type="text" name="cep" id="cep" value="{{ $user['cep'] }}" required>
        </div>

        <div>
            <label for="bairro">Bairro:</label>
            <input type="text" name="bairro" id="bairro" value="{{ $user['bairro'] }}" required>
        </div>

        <div>
            <label for="numero">Número:</label>
            <input type="text" name="numero" id="numero" value="{{ $user['numero'] }}" required>
        </div>

        <div>
            <label for="cidade">Cidade:</label>
            <input type="text" name="cidade" id="cidade" value="{{ $user['cidade'] }}" required>
        </div>

        <div>
            <label for="estado">Estado:</label>
            <input type="text" name="estado" id="estado" value="{{ $user['estado'] }}" required>
        </div>

        <button type="submit">Atualizar</button>
    </form>
    <a href="{{ route('users.index') }}">Voltar para a lista</a>
@endsection