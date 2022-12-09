import * as yup from "yup";
import { Marker } from "react-leaflet";
import { useForm } from "react-hook-form";
import { LeafletMouseEvent } from "leaflet";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import { User } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";
import phoneMask from "../../utils/phoneMask";
import { Button } from "../../components/Button";
import { Footer } from "../../components/Footer";
import { LeafletMap } from "../../components/LeafletMap";
import { HeaderFlow } from "../../components/HeaderFlow";
import { InputField } from "../../components/InputField";

import mapIcon from "../../utils/mapIcon";
import api from "../../services/geocodeApi";
import disappearanceApi from "../../services/disappearanceApi";

import styles from "./styles.module.scss";

interface IFormInputs
  extends Omit<
    User & {
      password: string;
    },
    "id"
  > {}

const schema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  email: yup.string().required("Email obrigatório"),
  password: yup.string().required("Senha obrigatória"),
  phone: yup.string().optional(),
  address: yup
    .object()
    .shape({
      city: yup.string(),
      state: yup.string(),
      latitude: yup.number(),
      longitude: yup.number(),
    })
    .required(),
});

export function SignUp() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IFormInputs>({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      phone: "",
      address: {
        city: "",
        latitude: 0,
        longitude: 0,
        uf: "",
      },
    },
  });

  const phone = watch("phone");
  const address = watch("address");

  const navigate = useNavigate();
  const { addToast } = useToast();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const onSubmit = useCallback(
    async (data: IFormInputs) => {
      try {
        const { data: user } = await disappearanceApi.post("/users", {
          name: data.name,
          password: data.password,
          email: data.email,
          phone: data.phone,
        });

        await disappearanceApi.post("users/address", {
          ...data.address,
          user_id: user.id,
        });

        addToast({
          type: "success",
          title: "Conta criada com sucesso",
          description:
            "Em breve, você será redirecionado para a página de login.",
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao criar a conta",
          description:
            "Ocorreu um erro ao criar a conta. Tente novamente em alguns instantes.",
        });
      }
    },
    [navigate, addToast],
  );

  const handleOnClickMap = useCallback(
    async (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      setPosition({
        latitude: lat,
        longitude: lng,
      });

      const { data } = await api.get("/data/reverse-geocode-client", {
        params: {
          latitude: lat,
          longitude: lng,
          localityLanguage: "pt",
        },
      });

      setValue("address", {
        ...data.address,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        uf: data.principalSubdivisionCode.slice(-2),
      });
    },
    [setValue],
  );

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
          <h1>Faça seu Cadastro</h1>

          <fieldset>
            <legend>
              <h2>Informações</h2>
            </legend>

            <InputField
              errorMessage={errors.name?.message}
              register={register("name")}
              type="text"
              label="Nome"
            />

            <InputField
              errorMessage={errors.email?.message}
              register={register("email")}
              type="text"
              label="Email"
            />

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
                type="password"
                label="Senha"
                errorMessage={errors.password?.message}
                register={register("password")}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Seu endereço</h2>
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
                value={address.city}
                label="Cidade"
              />

              <InputField
                id="uf"
                name="uf"
                disabled
                type="text"
                value={address.uf}
                label="Estado(UF)"
              />
            </div>
          </fieldset>

          <Button
            type="submit"
            title="Cadastrar"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          />
        </form>
      </div>

      <Footer />
    </div>
  );
}
