<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class UserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if(Auth::user()->role=='admin'){
            return redirect('/admin-dashboard')->with('status','Successfully logged in as Admin');
        }else if(Auth::user()->role=="HeadDepartment"){
            return redirect('/HeadDepartment-dashboard')->with('status','Successfully logged in as a Head of Department');

        }
          else if(Auth::user()->role=="FormTeacher"){
            return redirect('/FormTeacher-dashboard')->with('status','Successfully logged in as a Form Teacher');

          }else{
            return redirect('/teacher-dashboard')->with('status','Successfully logged in');

          }
    }
}
