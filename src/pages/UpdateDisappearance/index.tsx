import * as yup from "yup";
import Select from "react-select";
import { Marker } from "react-leaflet";
import { useForm } from "react-hook-form";
import { LeafletMouseEvent } from "leaflet";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "../../hooks/toast";
import { Button } from "../../components/Button";
import { Footer } from "../../components/Footer";
import { LeafletMap } from "../../components/LeafletMap";
import { HeaderFlow } from "../../components/HeaderFlow";
import { InputField } from "../../components/InputField";
import { TextareaField } from "../../components/TextareaField";

import mapIcon from "../../utils/mapIcon";
import phoneMask from "../../utils/phoneMask";
import geocodeApi from "../../services/geocodeApi";
import disappearanceApi from "../../services/disappearanceApi";

import { Trash } from "phosphor-react";
import styles from "./styles.module.scss";

interface Disappearance {
  id: string;
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

export function UpdateDisappearance() {
  const navigate = useNavigate();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Disappearance>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      city: "",
      latitude: 0,
      longitude: 0,
      uf: "",
    },
  });

  const uf = watch("uf");
  const city = watch("city");
  const type = watch("type");

  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();

  const [isCenteredMap, setIsCenteredMap] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [disappearance, setDisappearance] = useState<Disappearance | null>(
    null,
  );

  const specieOptionSelected = useMemo(
    () => options.find((item) => item.value === type),
    [type],
  );

  const handleOnClickMap = useCallback(
    async (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      setIsCenteredMap(false);

      setPosition({
        latitude: Number(lat),
        longitude: Number(lng),
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
    async (data: Disappearance) => {
      try {
        await disappearanceApi.put(`/disappearances/${data.id}`, {
          ...data,
          latitude: Number(position.latitude),
          longitude: Number(position.longitude),
          image: `${String(data.type)}.png`,
        });

        addToast({
          type: "success",
          title: "Desaparecimento atualizado com sucesso",
          description: "Fique atento os comentários do seu registro",
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao atualizar desaparecimento.",
          description:
            "Ocorreu um erro ao atualizar o desaparecimento. Tente novamente em alguns instantes.",
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
    [addToast, position],
  );

  const handleDoneDisappearance = useCallback(async () => {
    setIsLoading(true);

    if (disappearance) {
      try {
        await disappearanceApi.put(`/disappearances/${disappearance.id}`, {
          ...disappearance,
          situation: "FOUND",
          latitude: Number(position.latitude),
          longitude: Number(position.longitude),
        });

        addToast({
          type: "success",
          title: "Desaparecimento finalizado com sucesso",
          description: "Ficamos felizes que você encontrou seu animalzinho.",
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        setIsLoading(false);

        setTimeout(() => {
          navigate("/map");
        }, 3000);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao finalizar desaparecimento.",
          description:
            "Ocorreu um erro ao finalizar o desaparecimento. Tente novamente em alguns instantes.",
        });

        setIsLoading(false);
      }
    }
  }, [disappearance, addToast, navigate, position]);

  const handleClosedDisappearance = useCallback(async () => {
    if (disappearance) {
      try {
        await disappearanceApi.delete(`/disappearances/${disappearance.id}`);

        addToast({
          type: "success",
          title: "Desaparecimento excluido com sucesso",
          description:
            "Agradecemos por utilizar nosso site, esperamos que tenha tido um desfecho feliz.",
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
          title: "Erro ao excluir desaparecimento.",
          description:
            "Ocorreu um erro ao excluir o desaparecimento. Tente novamente em alguns instantes.",
        });
      }
    }
  }, [disappearance, addToast, navigate]);

  useEffect(() => {
    async function loadDisappearance() {
      const { data } = await disappearanceApi.get<Disappearance>(
        `/disappearances/${id}`,
      );

      reset({
        ...data,
        phone: phoneMask(data.phone),
      });

      setDisappearance(data);

      setPosition({
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      });
    }

    loadDisappearance();
  }, [reset, id]);

  const handleChangePhone = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("phone", phoneMask(e.target.value.toString()));
    },
    [setValue],
  );

  return (
    <div className={styles.container}>
      <HeaderFlow />

      <div className={styles.content}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Atualização de um desaparecimento</h1>

          <button title="Excluir registro" className={styles.delete}>
            <Trash
              size={28}
              weight="fill"
              onClick={handleClosedDisappearance}
            />
          </button>

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
                onChange={(newValue) => {
                  setValue("type", String(newValue?.value));
                }}
                classNamePrefix="select"
                isClearable
                value={specieOptionSelected}
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
                errorMessage={errors.phone?.message}
                register={register("phone", {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangePhone(e),
                })}
                type="text"
                maxLength={15}
                label="Whatsapp"
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
                <LeafletMap
                  isCentered={isCenteredMap}
                  onClickMap={handleOnClickMap}
                  position={[position.latitude, position.longitude]}
                >
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

          {disappearance?.situation !== "FOUND" && (
            <div className={styles.actions}>
              <Button
                type="button"
                title="Finalizar"
                loading={isLoading}
                disabled={!isValid || isLoading}
                onClick={handleDoneDisappearance}
              />

              <Button
                type="submit"
                title="Atualizar"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
              />
            </div>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
}
