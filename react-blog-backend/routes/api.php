<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Use App\Http\Controllers\BlogController;
use App\Http\Controllers\TempImageController;

Route::post('blogs', [BlogController::class, 'store']);
Route::post('save-temp-image', [TempImageController::class, 'store']);
Route::get('blogs', [BlogController::class, 'index']);
Route::get('blogs/{id}', [BlogController::class, 'show']);
Route::put('blogs/{id}', [BlogController::class, 'update']);
Route::delete('blogs/{id}', [BlogController::class, 'destroy']);



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

