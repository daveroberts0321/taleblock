
<script lang="ts">
  import '../app.css';
  let { children, data } = $props();
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaleBlock
            </span>
          </a>
          
          <div class="hidden md:flex ml-8 space-x-1">
            <a 
              href="/browse" 
              class="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Browse
            </a>
            <a 
              href="/latest" 
              class="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Latest
            </a>
            <a 
              href="/create" 
              class="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Write
            </a>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          {#if data.user}
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {data.user.username[0].toUpperCase()}
                </div>
                <span class="text-sm font-medium text-gray-700">
                  {data.user.username}
                </span>
              </div>
              <form action="/logout" method="POST">
                <button 
                  type="submit" 
                  class="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          {:else}
            <a 
              href="/login" 
              class="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Login
            </a>
            <a 
              href="/register" 
              class="px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors shadow-sm"
            >
              Sign up
            </a>
          {/if}

          <!-- Mobile menu button -->
          <button 
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {@render children()}
  </main>
</div>
