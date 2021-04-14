class CardMovie extends HTMLElement{
    connectedCallback(){
        this.render()
    }

    set setData(data){
        return this.data = {...data}
    }

    render(){
        const {poster_path,title,listGenre,id} = this.data
        const classList = "col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3".split(' ')
        this.classList.add(...classList)
        this.innerHTML = `
        <div class="card-movie" data-movie-id="${id}">
            <div class="card-image">
            <img
                src="https://image.tmdb.org/t/p/original/${poster_path}"
                alt=""
            />
            </div>
            <span class="title-movie">${title}</span>
            ${listGenre.join(" ")}
        </div>`
    }
}

customElements.define('card-movie',CardMovie)