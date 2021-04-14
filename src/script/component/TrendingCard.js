class TrendingCard extends HTMLElement {
    constructor(){
        super()
    }
    connectedCallback() {
        if(this.data){
            this.render()
        }
    }

    set setData(data) {
        return this.data = { ...data }
    }

    render() {
        const { poster_path, id } = this.data;
        this.classList.add("swiper-slide", "trending-card")
        this.dataset.movieId = id
        this.innerHTML = `
                <img
                class="trending-image"
                src="https://image.tmdb.org/t/p/original${poster_path}"
                alt=""
                />`
    }
}

customElements.define('trending-card', TrendingCard)