import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchLists } from "./api/api";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lists, setLists] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef();

  const getListsData = () => {
    setLoading(true);
    setError(false);
    fetchLists(search, page)
      .then((data) => {
        if (hasMore) {
          setLists((prev) => {
            return [...new Set([...prev, ...data])];
          });
        } else {
          setLists(data);
        }
        setHasMore(data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
      });
  };

  const handleChange = (e) => {
    const { value } = e?.target;
    setSearch(value);
    setPage(1);
  };

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    getListsData();
  }, [search, page]);

  useEffect(() => {
    setLists([]);
  }, [search]);

  return (
    <div className="App">
      <div>Infinite Scroll Example</div>
      <input type="text" value={search} onChange={handleChange} />

      <div>
        {lists?.map((list, index) => {
          if (lists?.length === index + 1) {
            return (
              <div ref={lastElementRef} key={index}>
                {list?.id} - {list?.name}
              </div>
            );
          } else {
            return (
              <div key={index}>
                {list?.id} - {list?.name}
              </div>
            );
          }
        })}
      </div>

      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
};

export default App;
