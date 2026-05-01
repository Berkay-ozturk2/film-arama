$(function(){
  const $input  = $('#searchInput');
  const $btn    = $('#searchBtn');
  const $grid   = $('#resultsGrid');
  const $status = $('#statusArea');

  // ÖNEMLİ: Kendi TMDb API Anahtarını buraya yapıştır
  const apiKey = 'fb496c19788d90b1a1887410a059e897';

  function doSearch(){
    const q = $.trim($input.val());
    if(!q) return;

    $grid.empty();
    $status.html('<div class="status-msg"><div class="spinner-border mb-3" role="status"></div><br>Filmler aranıyor…</div>');

    // TMDb API URL'si (Türkçe dil desteği eklendi)
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(q)}&language=tr-TR`;

    $.getJSON(url)
      .done(function(data){
        $status.empty();
        
        // TMDb'de sonuçlar 'results' dizisi içinde gelir
        if(!data.results || !data.results.length){
          $status.html('<div class="status-msg">😕 Film bulunamadı. Farklı bir isim deneyin!</div>');
          return;
        }

        $.each(data.results, function(i, movie){
          // TMDb resim yolu oluşturma
          const img = movie.poster_path 
            ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path 
            : null;
            
          const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;
          const releaseDate = movie.release_date ? movie.release_date.split('-')[0] : 'Bilinmiyor';
          const tmdbUrl = 'https://www.themoviedb.org/movie/' + movie.id;

          const imgHtml = img
            ? `<img src="${img}" alt="${$('<span>').text(movie.title).html()}" loading="lazy">`
            : '<div class="no-img-placeholder">Resim Mevcut Değil</div>';

          const ratingHtml = rating
            ? `<span class="rating-badge">★ ${rating}</span>`
            : '';

          // TMDb arama sonuçlarında tür isimlerini doğrudan göndermez (ID gönderir), 
          // bu yüzden tür yerine vizyon tarihini eklemek daha sağlıklı bir görsel sunar.
          const metaHtml = `<span class="meta-tag">${releaseDate}</span>`;

          const card = `
            <div class="col-12 col-sm-6 col-lg-3 fade-up" style="animation-delay:${i*60}ms">
              <div class="show-card">
                <div class="card-img-wrap">${imgHtml}${ratingHtml}</div>
                <div class="card-body-custom">
                  <h5>${$('<span>').text(movie.title).html()}</h5>
                  <div class="meta-row">${metaHtml}</div>
                  <a href="${tmdbUrl}" target="_blank" rel="noopener" class="btn-details">Detayları Gör</a>
                </div>
              </div>
            </div>`;
          $grid.append(card);
        });
      })
      .fail(function(){
        $status.html('<div class="status-msg">⚠️ Bir hata oluştu. API anahtarınızı ve bağlantınızı kontrol edin.</div>');
      });
  }

  $btn.on('click', doSearch);
  $input.on('keydown', function(e){ if(e.key==='Enter') doSearch(); });
  $input.trigger('focus');
});