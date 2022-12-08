import * as yup from "yup";
import Select from "react-select";
import { Marker } from "react-leaflet";
import { useForm } from "react-hook-form";
import { LeafletMouseEvent } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import mapIcon from "../../utils/mapIcon";
import { useToast } from "../../hooks/toast";
import { Footer } from "../../components/Footer";
import { LeafletMap } from "../../components/LeafletMap";
import { HeaderFlow } from "../../components/HeaderFlow";
import { InputField } from "../../components/InputField";
import { TextareaField } from "../../components/TextareaField";

import styles from "./styles.module.scss";
import phoneMask from "../../utils/phoneMask";
import geocodeApi from "../../services/geocodeApi";
import disappearanceApi from "../../services/disappearanceApi";
import { useAuth } from "../../hooks/auth";

interface IFormInputs {
  name: string;
  description: string;
  type: string;
  image: string;
  situation: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  phone: string;
  email: string;
}

const options = [
  { value: "dog", label: "Cachorro" },
  { value: "bird", label: "Passáro" },
  { value: "cat", label: "Gato" },
  { value: "horse", label: "Cavalo" },
  { value: "rodent", label: "Roedor" },
  { value: "cow", label: "Vaca" },
];

const schema = yup.object().shape({
  name: yup.string().required("Nome do animal obrigatório"),
  type: yup
    .string()
    .oneOf(options.map((item) => item.value))
    .required("Espécie obrigatória"),
  phone: yup.string(),
  email: yup.string(),
  description: yup.string().required("Descrição obrigatória"),
  city: yup.string().required("Selecione um lugar no mapa acima"),
  uf: yup.string().required("Selecione um lugar no mapa acima"),
});

export function CreateDisappearance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      city: "",
      latitude: 0,
      longitude: 0,
      uf: "",
      type: options[0].value,
    },
  });

  const uf = watch("uf");
  const city = watch("city");
  const phone = watch("phone");

  const { addToast } = useToast();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const handleOnClickMap = useCallback(
    async (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      setPosition({
        latitude: lat,
        longitude: lng,
      });

      const { data } = await geocodeApi.get("/data/reverse-geocode-client", {
        params: {
          latitude: lat,
          longitude: lng,
          localityLanguage: "pt",
        },
      });

      setValue("city", data.city);
      setValue("uf", data.principalSubdivisionCode.slice(-2));
    },
    [setValue],
  );

  const onSubmit = useCallback(
    async (data: IFormInputs) => {
      try {
        await disappearanceApi.post("/disappearances", {
          ...data,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          image: `${String(data.type)}.png`,
        });

        addToast({
          type: "success",
          title: "Desaparecimento criado com sucesso",
          description: "Você será redirecionado para a página do Mapa",
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        setTimeout(() => {
          navigate("/map");
        }, 3000);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao criar desaparecimento.",
          description:
            "Ocorreu um erro ao criar o desaparecimento. Tente novamente em alguns instantes.",
        });
      }
    },
    [addToast, navigate],
  );

  const handleChangePhone = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("phone", phoneMask(e.target.value.toString()));
    },
    [setValue],
  );

  useEffect(() => {
    if (!user) {
      addToast({
        type: "error",
        title: "Você precisa logar.",
        description:
          "Para criar um registro, você precisa estar logado na plataforma.",
      });

      navigate("/signin");
    }
  }, [user, addToast, navigate]);

  return (
    <div className={styles.container}>
      <HeaderFlow />

      <div className={styles.content}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Cadastro de um animal</h1>

          <fieldset>
            <legend>
              <h2>Informações</h2>
            </legend>

            <InputField
              errorMessage={errors.name?.message}
              register={register("name")}
              type="text"
              label="O animal atende por"
            />

            <div className={styles.selectContainer}>
              <span>Espécie</span>
              <Select
                classNamePrefix="select"
                isClearable
                name="type"
                options={options}
                styles={{
                  menu: (styles) => ({
                    ...styles,
                    zIndex: 1000,
                  }),
                  control: (styles) => ({
                    ...styles,
                    backgroundColor: "var(--gray-200)",
                    fontSize: "0.875rem",
                    border: "none",

                    "&.select__control--is-focused": {
                      borderColor: "var(--yellow-800)",
                      boxShadow: "0 0 0 1px var(--yellow-800)",
                    },

                    "&:hover": {
                      boxShadow: "none",
                      borderColor: "none",
                    },
                  }),
                  singleValue: (styles) => ({
                    ...styles,
                    fontSize: "0.875rem",
                  }),
                }}
                placeholder="Selecione uma espécie..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <InputField
                type="text"
                maxLength={15}
                label="Telefone"
                errorMessage={errors.phone?.message}
                register={
                  (register("phone"),
                  {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangePhone(e),
                  })
                }
                value={phone}
              />

              <InputField
                errorMessage={errors.email?.message}
                register={register("email")}
                type="email"
                label="Email"
              />
            </div>

            <TextareaField
              errorMessage={errors.description?.message}
              register={register("description")}
              label="Sobre"
            />
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
            </legend>

            <div className={styles.mapContainer}>
              <div className={styles.mapContent}>
                <LeafletMap onClickMap={handleOnClickMap}>
                  {position.latitude !== 0 && (
                    <Marker
                      interactive={false}
                      icon={mapIcon}
                      position={[position.latitude, position.longitude]}
                    />
                  )}
                </LeafletMap>
              </div>

              <div className={styles.mapFooter}>
                <strong>Clique no mapa para adicionar a localização</strong>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <InputField
                id="city"
                disabled
                name="city"
                type="text"
                label="Cidade"
                value={city}
              />

              <InputField
                id="uf"
                name="uf"
                disabled
                type="text"
                value={uf}
                label="Estado(UF)"
              />
            </div>
          </fieldset>

          <button type="submit" title="Cadastrar" disabled={!isValid}>
            Cadastrar
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
