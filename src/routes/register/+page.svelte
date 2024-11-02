
<script lang="ts">
  let { form } = $props();
</script>

<div class="max-w-md mx-auto mt-8">
  <h1 class="text-2xl font-bold mb-6">Create an Account</h1>
  
  <form method="POST" class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">
        Username
      </label>
      <input
        id="username"
        name="username"
        type="text"
        required
        value={form?.username ?? ''}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={form?.email ?? ''}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
        Confirm Password
      </label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    {#if form?.error}
      <p class="text-red-500 text-sm">{form.error}</p>
    {/if}

    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Create Account
    </button>
  </form>

  <p class="mt-4 text-center text-sm text-gray-600">
    Already have an account? 
    <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
      Sign in
    </a>
  </p>
</div>