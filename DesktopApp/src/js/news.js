// News page initialization
export default function initNews() {
  const newsContainer = document.getElementById('news-container');

  // Static news data as the backend is removed
  const newsData = {
    articles: [
      {
        title: 'The Rise of AI in Modern Development',
        source: { name: 'Tech Today' },
        publishedAt: new Date('2025-08-14T12:00:00Z').toISOString(),
        description: 'Artificial intelligence is revolutionizing the way we build software, from automated testing to AI-powered coding assistants.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1120&q=80'
      },
      {
        title: 'Frontend Frameworks: A 2025 Comparison',
        source: { name: 'Dev Weekly' },
        publishedAt: new Date('2025-08-13T11:00:00Z').toISOString(),
        description: 'A deep dive into the most popular frontend frameworks of the year, including React, Vue, and Svelte, and what makes them tick.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      }
    ]
  };

  renderNews(newsData);
}

function renderNews(newsData) {
  const newsContainer = document.getElementById('news-container');
  
  if (newsData.error) {
    newsContainer.innerHTML = `<p class="error">${newsData.error}</p>`;
    return;
  }

  newsContainer.innerHTML = '';
  
  newsData.articles.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.className = 'news-card';
    articleElement.innerHTML = `
      <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title}" class="news-image">
      <div class="news-content">
        <h3>${article.title}</h3>
        <p class="news-source">${article.source.name} - ${new Date(article.publishedAt).toLocaleDateString()}</p>
        <p class="news-description">${article.description || ''}</p>
        <a href="${article.url}" target="_blank" class="news-link">Read more</a>
      </div>
    `;
    newsContainer.appendChild(articleElement);
  });
}