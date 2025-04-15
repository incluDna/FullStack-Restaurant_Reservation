export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex flex-col justify-center px-8 py-12 w-full max-w-md mx-auto lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 text-center">
            <svg className="mx-auto h-10 w-auto text-[#f8b040]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.371 0 0 5.373 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12C24 5.373 18.629 0 12 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center">Sign in to your account</h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Not a member?{" "}
            <a href="#" className="font-medium text-[#f8b040] hover:underline">
              Start a 14 day free trial
            </a>
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-[#f8b040] hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#f8b040] text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Right image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="/images/login-bg.png"
          className="h-full w-full object-cover"
          alt="Login background"
        />
      </div>
    </div>
  );
}
