<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

//User API
// Route::get('/posts', [App\Http\Controllers\UserController::class, 'index']);
// Route::get('/users/{id}', [App\Http\Controllers\UserController::class, 'show']);
});