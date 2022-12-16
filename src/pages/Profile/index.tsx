import * as yup from "yup";
import { Marker } from "react-leaflet";
import { useForm } from "react-hook-form";
import { LeafletMouseEvent } from "leaflet";
import { PencilLine } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";

import { useToast } from "../../hooks/toast";
import { useAuth, User } from "../../hooks/auth";

import { Card } from "../../components/Card";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/Button";
import { AddCard } from "../../components/AddCard";
import { Skeleton } from "../../components/Skeleton";
import { LeafletMap } from "../../components/LeafletMap";
import { HeaderFlow } from "../../components/HeaderFlow";
import { InputField } from "../../components/InputField";

import mapIcon from "../../utils/mapIcon";
import api from "../../services/geocodeApi";
import disappearanceApi from "../../services/disappearanceApi";

import { DisappearanceProps } from "../../types";
import phoneMask from "../../utils/phoneMask";
import styles from "./styles.module.scss";

interface IFormInputs extends User {
  password?: string;
  old_password?: string;
  password_confirmation?: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  email: yup.string().required("Email obrigatório"),
  old_password: yup.string(),
  password: yup.string().when("old_password", {
    is: (val: string) => !!val,
    then: yup.string().required("Campo Obrigatório"),
    otherwise: yup.string(),
  }),
  password_confirmation: yup
    .string()
    .when("password", {
      is: (val: string) => !!val,
      then: yup.string().required("Campo Obrigatório"),
      otherwise: yup.string(),
    })
    .oneOf([yup.ref("password"), undefined], "Confirmação Incorreta"),
  phone: yup.string().optional(),
  address: yup
    .object()
    .shape({
      uf: yup.string(),
      city: yup.string(),
      latitude: yup.number(),
      longitude: yup.number(),
    })
    .required(),
});

export function Profile() {
  const {
    reset,
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: "",
      address: {
        uf: "",
        city: "",
      },
    },
  });

  const phone = watch("phone");
  const uf = watch("address.uf");
  const city = watch("address.city");

  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, updateUser, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnableEdit, setIsEnableEdit] = useState(false);
  const [isCenteredMap, setIsCenteredMap] = useState(true);
  const [disappearances, setDisappearances] = useState<DisappearanceProps[]>(
    [],
  );
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    getDisappearances();

    async function getDisappearances() {
      const { data } = await disappearanceApi.get(
        `/disappearances/my-disappearances`,
      );

      setDisappearances(data);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await disappearanceApi.get<User>("/users/me");
        reset({
          ...data,
          phone: data.phone ?? "",
        });

        setPosition({
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        });
      } catch (error: any) {
        if (error.response.data.statusCode === 401) {
          signOut();

          addToast({
            type: "error",
            title: "Sessão perdida!",
            description: "Você foi deslogado. Faça o login novamente.",
          });
        }
      }
    }

    if (!user) {
      navigate("/");
    } else {
      getUserData();
    }
  }, [reset, navigate, user, signOut, addToast]);

  const handleOnClickMap = useCallback(
    async (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      setIsCenteredMap(false);

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
        ...user.address,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        uf: data.principalSubdivisionCode.slice(-2),
      });
    },
    [setValue, user],
  );

  const onSubmit = useCallback(
    async (data: IFormInputs) => {
      try {
        const formData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          ...(data.old_password
            ? {
                old_password: data.old_password,
                password: data.old_password,
                password_confirmation: data.password_confirmation,
              }
            : {}),
        };

        await disappearanceApi.put(`/users/${data.id}`, formData);
        await disappearanceApi.put(
          `users/address/${data.address.id}`,
          data.address,
        );

        addToast({
          type: "success",
          title: "Perfil atualizado!",
          description: "Seu perfil foi atualizado com sucesso.",
        });

        updateUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        });

        window.scrollTo({
          behavior: "smooth",
          top: 0,
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro na atualização do perfil",
          description:
            "Ocorreu um erro ao atualizar sua conta. Tente novamente em alguns instantes.",
        });

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
    [addToast, updateUser],
  );

  const handleToggleEnableEdit = () => {
    setIsEnableEdit((prevState) => !prevState);
  };

  const handleChangeActiveTab = (value: 1 | 2) => {
    setActiveTab(value);
  };

  const handleChangePhone = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue("phone", phoneMask(e.target.value.toString()));
    },
    [setValue],
  );

  return (
    <div className={styles.container}>
      <HeaderFlow />

      <div className={styles.tabs}>
        <span
          onClick={() => handleChangeActiveTab(1)}
          className={activeTab === 1 ? styles.active : ""}
        >
          Meu dados
        </span>
        <span
          onClick={() => handleChangeActiveTab(2)}
          className={activeTab === 2 ? styles.active : ""}
        >
          Meus cadastros
        </span>
      </div>

      <div className={styles.content}>
        {activeTab === 1 ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <PencilLine
              size={28}
              weight="fill"
              onClick={handleToggleEnableEdit}
            />
            <h1>Perfil</h1>

            <fieldset>
              <legend>
                <h2>Seus dados</h2>
              </legend>

              <InputField
                errorMessage={errors.name?.message}
                register={register("name")}
                type="text"
                label="Nome"
                disabled={!isEnableEdit}
              />

              <InputField
                errorMessage={errors.email?.message}
                register={register("email")}
                type="text"
                label="Email"
                disabled={!isEnableEdit}
              />

              <InputField
                type="text"
                maxLength={15}
                label="Telefone"
                errorMessage={errors.phone?.message}
                register={register("phone", {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangePhone(e),
                })}
                disabled={!isEnableEdit}
                value={phone}
              />

              <div className={styles.fieldGroup}>
                <InputField
                  type="password"
                  label="Senha Atual"
                  errorMessage={errors.old_password?.message}
                  register={register("old_password")}
                  disabled={!isEnableEdit}
                />

                <InputField
                  type="password"
                  label="Nova Senha"
                  errorMessage={errors.password?.message}
                  register={register("password")}
                  disabled={!isEnableEdit}
                />

                <InputField
                  type="password"
                  label="Confirmar Senha"
                  errorMessage={errors.password_confirmation?.message}
                  register={register("password_confirmation")}
                  disabled={!isEnableEdit}
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <h2>Seu endereço</h2>
              </legend>

              <div className={styles.mapContainer}>
                <div className={styles.mapContent}>
                  <LeafletMap
                    isCentered={isCenteredMap}
                    onClickMap={handleOnClickMap}
                    isEnableTouch={isEnableEdit}
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
                  value={city}
                  label="Cidade"
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

            <Button
              type="submit"
              title="Editar"
              loading={isSubmitting}
              disabled={!isEnableEdit || isSubmitting}
            />
          </form>
        ) : (
          <section className={styles.grid}>
            {isLoading ? (
              new Array(9).fill("").map((_, index) => <Skeleton key={index} />)
            ) : disappearances.length > 0 ? (
              disappearances.map((disappearance: DisappearanceProps) => (
                <Card key={disappearance.id} disappearance={disappearance} />
              ))
            ) : (
              <AddCard />
            )}
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
