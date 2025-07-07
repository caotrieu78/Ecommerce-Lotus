<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProductSearch;
use Illuminate\Http\Request;

class ProductSearchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->only(['store']);
    }

    //  Ghi lại từ khóa tìm kiếm
    public function store(Request $request)
    {
        $validated = $request->validate([
            'SearchKeyword' => 'required|string|max:255',
        ]);

        ProductSearch::create([
            'UserID' => auth()->id(),
            'SearchKeyword' => $validated['SearchKeyword'],
            'SearchedAt' => now(),
        ]);

        return response()->json(['message' => 'Đã ghi nhận tìm kiếm'], 201);
    }

    //  Admin: Thống kê từ khóa tìm kiếm phổ biến
    public function topKeywords()
    {
        $keywords = ProductSearch::selectRaw('SearchKeyword, COUNT(*) as Total')
            ->groupBy('SearchKeyword')
            ->orderByDesc('Total')
            ->limit(10)
            ->get();

        return response()->json($keywords);
    }
}
