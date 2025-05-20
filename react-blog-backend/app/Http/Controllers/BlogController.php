<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Models\TempImage;

class BlogController extends Controller
{
    //This method will return all blogs

    public function index(Request $request)
    {

        $blogs = Blog::orderBy('created_at', 'DESC');

        if(!empty($request->keyword)) {
            $blogs = $blogs->where('title', 'LIKE', '%' . $request->keyword . '%');
        }
        $blogs = $blogs->get();



        return response()->json([
            'status' => true,
            // 'message' => 'Blogs fetched successfully',
            'data' => $blogs
        ]);
    }


    //This method will return a single blog
    public function show($id)
    {

        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found'
            ], 404);
        }

        $blog['date'] = \Carbon\Carbon::parse($blog->created_at)->format('d M Y');

        return response()->json([
            'status' => true,
            'data' => $blog
        ]);
    }


    //This method will store a blog
    public function store(Request $request)
    {

        //Validate the request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:5',
            'author' => 'required|string|min:3',
            'shortDesc' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors',
                'errors' => $validator->errors()
            ]);
        }



        $blog = new Blog();
        $blog->title = $request->title;
        $blog->author = $request->author;
        $blog->shortDesc = $request->shortDesc;
        $blog->description = $request->description;
        $blog->save();


        //save image here
        $tempImage = TempImage::find($request->image_id);

        if ($tempImage != null) {
            $imageExtArray = explode('.', $tempImage->name);
            $ext = last($imageExtArray);
            $imageName = time() . '.' . $blog->id . '.' . $ext;

            // Delete the temp image after copying
            $sourcePath = public_path('uploads/temp/' . $tempImage->name);
            $destPath = public_path('uploads/blogs/' . $imageName);
            File::copy($sourcePath, $destPath);


            $blog->image = $imageName;
            $blog->save();
        }



        return response()->json([
            'status' => true,
            'message' => 'Blog Added Successfully',
            'data' => $blog
        ]);
    }




    //This method will update a blog
    public function update($id, Request $request)
{
    $blog = Blog::find($id);

    if (!$blog) {
        return response()->json([
            'status' => false,
            'message' => 'Blog not found'
        ], 404);
    }

    // Validate input
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|min:5',
        'author' => 'required|string|min:3',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Please fix the errors',
            'errors' => $validator->errors()
        ]);
    }

    // Update text fields
    $blog->title = $request->title;
    $blog->author = $request->author;
    $blog->shortDesc = $request->shortDesc ?? '';
    $blog->description = $request->description ?? '';

    // Handle image replacement
    if ($request->image_id) {
        $tempImage = TempImage::find($request->image_id);

        if ($tempImage) {
            $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
            $imageName = time() . '.' . $blog->id . '.' . $ext;

            $sourcePath = public_path('uploads/temp/' . $tempImage->name);
            $destPath = public_path('uploads/blogs/' . $imageName);

            if (File::exists($sourcePath)) {
                // 🔥 Delete old image if it exists
                $oldImagePath = public_path('uploads/blogs/' . $blog->image);
                if ($blog->image && File::exists($oldImagePath)) {
                    File::delete($oldImagePath);
                }

                // Copy new image
                File::copy($sourcePath, $destPath);

                // Save new image name
                $blog->image = $imageName;
            }
        }
    }

    $blog->save();

    return response()->json([
        'status' => true,
        'message' => 'Blog Updated Successfully',
        'data' => $blog
    ]);
}



    //This method will delete a blog
    public function destroy($id) {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found'
            ], 404);
        }

        // Delete the image file if it exists
        if ($blog->image) {
            $imagePath = public_path('uploads/blogs/' . $blog->image);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }
        }

        $blog->delete();

        return response()->json([
            'status' => true,
            'message' => 'Blog Deleted Successfully'
        ]);
    }
}
