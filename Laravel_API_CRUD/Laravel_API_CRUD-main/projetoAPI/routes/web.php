<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

// Rotas da API para usuários
Route::prefix('users')->group(function () {
    // Listar todos os usuários (GET /api/users)
    Route::get('/', [UserController::class, 'index']);

    // Criar um novo usuário (POST /api/users)
    Route::post('/', [UserController::class, 'store']);

    // Mostrar detalhes de um usuário específico (GET /api/users/{id})
    Route::get('/{id}', [UserController::class, 'show']);

    // Atualizar um usuário existente (PUT /api/users/{id})
    Route::put('/{id}', [UserController::class, 'update']);

    // Deletar um usuário (DELETE /api/users/{id})
    Route::delete('/{id}', [UserController::class, 'destroy']);
});