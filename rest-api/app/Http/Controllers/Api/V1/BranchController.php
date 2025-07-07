<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Branch;

class BranchController extends Controller
{
    public function __construct()
    {
        // Chỉ Admin mới được thao tác nhạy cảm
        $this->middleware('admin')->only(['store', 'update', 'destroy']);
    }

    // Lấy danh sách tất cả chi nhánh
    public function index()
    {
        return response()->json(Branch::all(), 200);
    }

    // Lấy thông tin 1 chi nhánh
    public function show($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy chi nhánh'], 404);
        }
        return response()->json($branch, 200);
    }

    // Thêm chi nhánh mới (admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'BranchName' => 'required|string|max:100',
            'Address' => 'required|string|max:300',
            'City' => 'required|string|max:100',
            'Latitude' => 'nullable|numeric',
            'Longitude' => 'nullable|numeric',
            'Phone' => 'nullable|string|max:20',
            'Email' => 'nullable|email|max:100',
        ]);

        $branch = Branch::create($validated);
        return response()->json($branch, 201);
    }

    // Cập nhật chi nhánh (admin)
    public function update(Request $request, $id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy chi nhánh'], 404);
        }

        $validated = $request->validate([
            'BranchName' => 'sometimes|string|max:100',
            'Address' => 'sometimes|string|max:300',
            'City' => 'sometimes|string|max:100',
            'Latitude' => 'nullable|numeric',
            'Longitude' => 'nullable|numeric',
            'Phone' => 'nullable|string|max:20',
            'Email' => 'nullable|email|max:100',
        ]);

        $branch->update($validated);
        return response()->json($branch, 200);
    }

    // Xoá chi nhánh (admin)
    public function destroy($id)
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return response()->json(['message' => 'Không tìm thấy chi nhánh'], 404);
        }

        $branch->delete();
        return response()->json(['message' => 'Đã xoá chi nhánh'], 200);
    }
}
