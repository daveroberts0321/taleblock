
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  
  export let form: ActionData;
  
  let loading = false;
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
      Sign in to your account
    </h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form 
      method="POST" 
      class="space-y-6" 
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          await update();
        };
      }}
    >
      <div>
        <label for="username" class="block text-sm font-medium leading-6">
          Username
        </label>
        <div class="mt-2">
          <input
            id="username"
            name="username"
            type="text"
            required
            value={form?.username ?? ''}
            class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium leading-6">
          Password
        </label>
        <div class="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            required
            class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {#if form?.error}
        <div class="text-red-500 text-sm">
          {form.error}
        </div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={loading}
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-500">
      Not a member?
      <a href="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
        Create an account
      </a>
    </p>
  </div>
</div>