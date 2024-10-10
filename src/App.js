import React, { useState, useEffect } from 'react';

function App() {
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  // Función para obtener cócteles aleatorios
  const fetchRandomCocktails = async () => {
    setLoading(true);
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const data = await response.json();
    setCocktails([data.drinks[0]]);
    setLoading(false);
  };

  // Función para buscar cócteles basados en la query del usuario
  const fetchCocktailsByQuery = async (query) => {
    setLoading(true);
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    setCocktails(data.drinks || []);
    setLoading(false);
  };

  // Efecto para obtener cócteles aleatorios al cargar la página si no hay búsqueda
  useEffect(() => {
    if (query === '') {
      fetchRandomCocktails();
    }
  }, [query]);

  // Manejador de evento para el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      fetchCocktailsByQuery(query);
    } else {
      fetchRandomCocktails();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center text-pink-600 mb-6">Buscador de Cócteles</h1>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSubmit} className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Busca un cóctel..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-2 border-pink-400 rounded-lg p-2 text-lg w-80 mr-4"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-pink-600"
        >
          Buscar
        </button>
      </form>

      {/* Mostrar el estado de carga */}
      {loading && <h2 className="text-center text-xl">Cargando cócteles...</h2>}

      {/* Mostrar los cócteles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cocktails && cocktails.length > 0 ? (
          cocktails.map((cocktail, index) => (
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform"
              key={index}
            >
              <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-pink-600 mb-2">{cocktail.strDrink}</h2>
                <p className="text-gray-600 mb-1">Categoría: {cocktail.strCategory}</p>
                <p className="text-gray-600 mb-1">Tipo: {cocktail.strAlcoholic}</p>
                <p className="text-gray-600 mb-1">Vaso: {cocktail.strGlass}</p>
                
                <h3 className="text-lg font-semibold mt-2">Ingredientes:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {Array.from({ length: 15 }).map((_, i) => {
                    const ingredient = cocktail[`strIngredient${i + 1}`];
                    const measure = cocktail[`strMeasure${i + 1}`];
                    return (
                      ingredient ? (
                        <li key={i}>
                          {ingredient} {measure ? `- ${measure}` : ''}
                        </li>
                      ) : null
                    );
                  })}
                </ul>

                <h3 className="text-lg font-semibold mt-2">Instrucciones:</h3>
                <p className="text-gray-600">{cocktail.strInstructions}</p>

                {cocktail.strTags && (
                  <p className="text-gray-500 mt-2">Tags: {cocktail.strTags}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && <h2 className="text-center text-xl">No se encontraron cócteles</h2>
        )}
      </div>
    </div>
  );
}

export default App;
