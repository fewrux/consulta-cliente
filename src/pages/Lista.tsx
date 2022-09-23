import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import axios from "axios"

type Categoria = {
  Id: string;
  Nome: string;
}

const api = axios.create({
  baseURL: 'https://cnctesteapl.azurewebsites.net/odata/CategoriaCliente'
})

export function Lista() {
  const [newParameter, setNewParameter] = useState<string>('')

  const useFetch = () => {
    const url = '?$select=id,nome&$Filter=IdEntidadeSindical/Id%20eq%206a8be2a2-2636-43d4-b9c0-002a50888604'
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
      api.get(url)
      .then(response => {
        setCategorias(response.data.value);
      })
      .finally(() => {
        setIsFetching(false);
      })
    }), ([newParameter])

    return { categorias, isFetching }
  }

  const { categorias, isFetching } = useFetch()

  const handleDelete = (id: string) => {
    const url = `https://cnctesteapl.azurewebsites.net/odata/CategoriaCliente(${id})`

    const headers = {
      'Access-Control-Allow-Origin': "https://cnctesteapl.azurewebsites.net/",
    }

    axios.delete(url, { headers })
      .then(response => console.log(response))
  }

  return (
    <div>
      <Navbar />
      <div className="p-5 flex justify-center">
        <div className="container p-10 max-w-[700px] border border-zinc-300 rounded-2xl shadow-xl">
          <h2 className="text-3xl mb-4">Categoria Cliente</h2>
          <ul>
            { isFetching && <p>Carregando...</p> }
            {categorias?.map(categoria => {
              return (
                <li key={categoria.Id} className="flex justify-between gap-5 p-2 border-b border-solid border-zinc-300">
                  <p>{categoria.Nome}</p>
                  <button
                    onClick={() => {
                        handleDelete(categoria.Id)
                        setNewParameter(categoria.Id)
                      }}>
                      <i className="fa-regular fa-trash-can text-xs"></i>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
