<script lang="ts">
  let { data } = $props();

  const featuredBooks = [
  {
    title: "Aztec Sun",
    author: "Alex Turner",
    forks: 128,
    reads: 3420,
    coverImage: "/images/bookcover1.webp",
    summary: `In this thrilling adventure novel, Alex Turner, a seasoned archaeologist, uncovers a mysterious artifact hidden deep in the Amazon rainforest. 
    The golden amulet, inscribed with ancient symbols, is rumored to unlock the secrets of a lost civilization and unparalleled power. However, a dangerous 
    mercenary group led by a ruthless treasure hunter is hot on his trail, determined to claim the prize. With each step, Alex faces deadly traps and wild beasts, 
    relying on his survival instincts to stay one step ahead in the jungle.`
  },
  {
    title: "Galactic Siege",
    author: "Raymond Knox",
    forks: 312,
    reads: 9280,
    coverImage: "/images/book2.webp",
    summary: `In the year 2583, humanity is at war with a ruthless alien race known as the Draegon. Captain Zara Voss, a hardened space pilot, 
    leads her fleet on a last-ditch mission to defend Earth’s outer colonies. As fierce space battles erupt across the galaxy, Voss’s unyielding courage 
    and unmatched tactical skills are tested as she faces impossible odds. But as allies fall and hope fades, she uncovers a hidden weapon that could turn the tide, 
    or destroy everything she holds dear in this high-stakes combat space opera.`
  },
  {
    title: "The Coffee Date",
    author: "Lena Hart",
    forks: 156,
    reads: 4673,
    coverImage: "/images/book3.webp",
    summary: `When Sarah, a quirky bookstore owner, and Max, a reserved architect, accidentally swap phones at a coffee shop, their lives become unexpectedly intertwined. 
    Despite their differences and a series of hilarious misunderstandings, they find themselves reluctantly agreeing to help each other win over their respective crushes. 
    But as they navigate through awkward dates, late-night texts, and surprise encounters, Sarah and Max start to realize that maybe the perfect match they’re looking for 
    is standing right in front of them in this charming romantic comedy.`
  },
  {
  title: "The Guardians of Eldoria",
  author: "Ariana Swift",
  forks: 320,
  reads: 7482,
  coverImage: "/images/book4.webp",
  summary: `In the mystical land of Eldoria, young knight Kael Emberhart is chosen as a guardian to protect the sacred kingdom from the shadowy forces of the Darklands. 
  As Kael trains with wise elders and battles mythical creatures, he learns of an ancient prophecy that speaks of a powerful relic hidden within the Mountains of Dawn. 
  With a loyal band of adventurers, Kael journeys through enchanted forests, shimmering lakes, and hidden caverns to uncover the truth behind the prophecy. Will he 
  fulfill his destiny as a Guardian, or will the darkness consume Eldoria? This epic tale of courage, magic, and friendship brings to life a world filled with wonders and perils.`
}
];
</script>

<div class="min-h-screen bg-gradient-to-b from-white to-blue-50">
    <!-- Hero Section -->
    <div class="max-w-6xl mx-auto px-4 pt-20 pb-16">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TaleBlock
        </h1>
        <p class="text-2xl text-gray-600 mb-8">
          Where every story can branch into infinite possibilities
        </p>
        <div class="flex justify-center gap-4">
          <button class="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Start Reading
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </button>
          <button class="inline-flex items-center px-6 py-3 text-lg font-semibold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-lg">
            Create Story
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  
    <!-- Featured Books Section -->
    <div class="max-w-6xl mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold mb-12 text-center">Featured Stories</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each featuredBooks as book}
          <div class="group relative">
            <!-- Book Cover -->
            <div class="relative aspect-[2/3] mb-4 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <!-- Book Cover Image with Blur and Dark Overlay on Hover -->
              <img 
                src={book.coverImage} 
                alt={book.title}
                class="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
              />
  
              <!-- Dark Overlay for better contrast -->
              <div class="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  
              <!-- Overlay with title, author, and summary on hover -->
              <div class="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 class="text-lg font-bold leading-snug mb-1">{book.title}</h3>
                <p class="text-sm mb-2">{book.author}</p>
                <p class="text-xs leading-snug">{book.summary}</p>
              </div>
            </div>
  
            <!-- Book Stats -->
            <div class="flex items-center justify-between text-sm text-gray-600">
              <div class="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20.5a2.5 2.5 0 0 1-2.5-2.5V6.8a2.3 2.3 0 1 1 4.6 0V18c0 1.4-1.1 2.5-2.5 2.5Z"/>
                  <path d="M16 18a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2"/>
                </svg>
                <span>{book.reads.toLocaleString()} reads</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="18" r="3"/>
                  <circle cx="6" cy="6" r="3"/>
                  <circle cx="18" cy="6" r="3"/>
                  <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/>
                  <path d="M12 12v3"/>
                </svg>
                <span>{book.forks.toLocaleString()} forks</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
</div>


  <!-- CTA Section -->
  <div class="max-w-6xl mx-auto px-4 py-16 text-center">
    <h2 class="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
    <p class="text-xl text-gray-600 mb-8">
      Join our community of collaborative storytellers and readers today.
    </p>
    <button class="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
      Get Started
      <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </button>
  </div>
