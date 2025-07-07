<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsSeller
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->RoleID == 2) {
            return $next($request);
        }

        return response()->json(['message' => 'Không có quyền truy cập'], 403);
    }
}
