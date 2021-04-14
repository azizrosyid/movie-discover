class CarouselHome extends HTMLElement {
    connectedCallback() {
        this.render()
    }

    set setData(data) {
        return this.data = { ...data }
    }

    render() {
        const { index, title, backdrop_path, listGenre } = this.data
        this.classList.add('carousel-item')
        index ? "" : this.classList.add('active')
        this.innerHTML = `
            <div class="image-carousel">
                <div class="detailmovie-carousel">
                    <span class="title-carousel">${title}</span>
                    <div class="genre-carousel">
                    ${listGenre.join(" ")}
                    </div>
                </div>
                <img
                    src="https://image.tmdb.org/t/p/original/${backdrop_path}"
                    class="d-block w-100"
                    alt="..."
                />
            </div>`
    }
}

customElements.define('carousel-home', CarouselHome)