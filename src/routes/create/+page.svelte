<script lang="ts">
  let { data } = $props();
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">Create New Story</h1>
  
  <form method="POST" class="space-y-6">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">
        Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>

    <div>
      <label for="content" class="block text-sm font-medium text-gray-700">
        Content
      </label>
      <textarea
        id="content"
        name="content"
        rows="10"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      ></textarea>
    </div>

    <button
      type="submit"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Save Story
    </button>
  </form>
</div>