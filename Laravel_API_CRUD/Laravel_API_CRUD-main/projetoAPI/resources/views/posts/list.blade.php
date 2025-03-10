@extends('layouts.app')
@section('content')

    <h1>Detalhes do Usuário</h1>

    <div>
        <p><strong>Nome:</strong> {{ $user['nome'] }}</p>
        <p><strong>Data de Nascimento:</strong> {{ $user['dataNascimento'] }}</p>
        <p><strong>Email:</strong> {{ $user['email'] }}</p>
        <p><strong>CPF:</strong> {{ $user['cpf'] }}</p>
        <p><strong>Telefone:</strong> {{ $user['fone'] }}</p>
        <p><strong>Endereço:</strong></p>
        <ul>
            <li><strong>Rua:</strong> {{ $user['rua'] }}</li>
            <li><strong>CEP:</strong> {{ $user['cep'] }}</li>
            <li><strong>Bairro:</strong> {{ $user['bairro'] }}</li>
            <li><strong>Número:</strong> {{ $user['numero'] }}</li>
            <li><strong>Cidade:</strong> {{ $user['cidade'] }}</li>
            <li><strong>Estado:</strong> {{ $user['estado'] }}</li>
        </ul>
    </div>

    <a href="{{ route('users.edit', $user['id']) }}">Editar</a>
    <form action="{{ route('users.destroy', $user['id']) }}" method="POST" style="display:inline;">
        @csrf
        @method('DELETE')
        <button type="submit">Excluir</button>
    </form>
    <a href="{{ route('users.index') }}">Voltar para a lista</a>
@endsection