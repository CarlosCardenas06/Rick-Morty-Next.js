"use client";
import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import "../styles.css"; // Importa el archivo CSS
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
export default function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);
  const [totalRecords, setTotalRecord] = useState(0);
  const [visible, setVisible] = useState(false);
  const [character, setCharacter] = useState({});
  useEffect(() => {
    llamadoApi();
  }, [first]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setPagina(event.first / rows);
    setRows(event.rows);
  };

  const llamadoApi = () => {
    axiosInstance.get(`character?page=${pagina + 1}`).then((response) => {
      console.log("response", response);
      setCharacters(response.data.results);
      setTotalRecord(response.data.info.count);
    });
  };

  const enviar = (e) => {
    console.log("e", e);
    setVisible(true);
    setCharacter(e);
  };

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <Avatar size="xlarge" image={character.image} shape="circle" />
      <span className="font-bold white-space-nowrap">{character.name}</span>
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label="Cerrar"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        autoFocus
      />
    </div>
  );
  return (
    <div>
      <h1 className="flex justify-content-center">Rick and Morty App</h1>
      <div className="flex justify-content-center col-12">
        <div className="card">
          <div className="flex flex-wrap justify-content-center gap-2">
            {characters.map((character) => (
              <div
                className="flex justify-content-center align-items-center m-2"
                style={{ width: "300px" }}
                key={character.id}
              >
                <Card
                  title={character.name}
                  className="w-full align-content-center"
                  style={{ height: "550px" }}
                >
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full "
                  />
                  <div className="flex justify-content-center">
                    <p>Status: {character.status}</p>
                  </div>
                  <div className="flex justify-content-center">
                    <p>Species: {character.species}</p>
                  </div>

                  <div className="flex justify-content-center">
                    <Button onClick={() => enviar(character)}>
                      Más Información
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            className="paginator"
          />
        </div>
      </div>

      <Dialog
        visible={visible}
        modal
        header={headerElement}
        footer={footerContent}
        style={{ width: "30rem" }}
        onHide={() => setVisible(false)}
      >
        <div className="character-content">
          <img
            src={character.image}
            alt={character.name}
            className="character-image"
          />
          <div className="character-details">
            <p>
              <strong>Status:</strong> {character.status}
            </p>
            <p>
              <strong>Species:</strong> {character.species}
            </p>
            <p>
              <strong>Gender:</strong> {character.gender}
            </p>
            <p>
              <strong>Origin:</strong>{" "}
              <a href={character.url}>{character.name}</a>
            </p>
            <p>
              <strong>Location:</strong>{" "}
              <a href={character?.location?.url}>{character?.location?.name}</a>
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(character.created).toLocaleDateString()}
            </p>
            <p>
              <strong>Episodes:</strong>
            </p>
            <ul>
              {character?.episode?.slice(0, 5).map((ep, index) => (
                <li key={index}>
                  <a href={ep}>Episode {index + 1}</a>
                </li>
              ))}
              {character?.episode?.length > 5 && <li>...and more</li>}
            </ul>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
