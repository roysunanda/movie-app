// import { Client, Query, TablesDB, ID } from "appwrite";

// const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
// const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID

// const client = new Client();
// client
//   .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//   .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Replace with your project ID

// // export const account = new Account(client);
// const database = new TablesDB(client);

// const updateSearchCount = async (searchTerm, movie) => {
//   try {
//     const result = await database.listRows({DB_ID,
//       TABLE_ID,
//       [Query.equal('searchTerm', searchTerm)]})

//     if(result.documents.length > 0) {
//       const doc = result.documents[0]

//       await database.updateRow({DB_ID, TABLE_ID, doc.$id, data: {
//         count: doc.count + 1
//       }})
//     } else {
//       await database.createRow({DB_ID, TABLE_ID, ID.unique(), data: {
//         searchTerm,
//         count: 1,
//         movie_id: movie.id,
//         poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
//       }})
//     }
//   } catch (error) {
//     console.error(error,message)
//   }
// }

// export { client, database, updateSearchCount };

import { Client, ID, Query, TablesDB } from "appwrite";

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const database = new TablesDB(client);

const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listRows({
      databaseId: DB_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    if (result.rows.length > 0) {
      const row = result.rows[0];

      await database.updateRow({
        databaseId: DB_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: {
          count: row.count + 1,
        },
      });
    } else {
      await database.createRow({
        databaseId: DB_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.error("Failed to update search count:", error);
  }
};

const getTrendingMovies = async () => {
  try {
    const result = await database.listRows({
      databaseId: DB_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });
    return result.rows;
  } catch (error) {
    console.error(error.message);
  }
};

export { client, database, updateSearchCount, getTrendingMovies };
