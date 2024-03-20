import Header from "@/components/Header";
import Center from "@/components/Center";
import Input from "@/components/Input";
import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import { debounce } from "lodash";
import Spinner from "@/components/Spinner";
import Script from "next/script";

const SearchInput = styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  font-size:1.4rem;
`;
const InputWrapper = styled.div`
  position:sticky;
  top:68px;
  margin: 25px 0;
  padding: 5px 0;
  background-color: #eeeeeeaa;
  z-index:9;
`;

export default function SearchPage() {
  const [phrase, setPhrase] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useCallback(
    debounce(searchProducts, 500), []
  );
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios.get('/api/products?phrase=' + encodeURIComponent(phrase))
      .then(response => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }
  return (
    <>
      <Script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></Script>
      <df-messenger
        chat-title="Ecommerce Store"
        agent-id="c8603bc4-e1f8-45ac-bf1d-3d1898fcbf36"
        language-code="en"
        customCss={`--df-messenger-button-color: #222;`}
      ></df-messenger>
      <Header />
      <Center>
        <InputWrapper>
          <SearchInput
            autoFocus
            value={phrase}
            onChange={ev => setPhrase(ev.target.value)}
            placeholder="Search for products..." />
        </InputWrapper>
        {!isLoading && phrase !== '' && products.length === 0 && (
          <h2>No products found for query "{phrase}"</h2>
        )}
        {isLoading && (
          <Spinner fullWidth={true} />
        )}
        {!isLoading && products.length > 0 && (
          <ProductsGrid products={products} />
        )}
      </Center>
    </>
  );
}