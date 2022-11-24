import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Lock,
  SignOut,
  LockOpen,
  EnvelopeSimple,
} from "phosphor-react";

import styles from "./styles.module.scss";
import logo from "../../assets/logo-yellow.png";
import api from "../../services/dissapearanceApi";
import { HeaderFlow } from "../../components/HeaderFlow";
import { InputField } from "../../components/InputField";
import resetPasswordImg from "../../assets/reset-password-img.png";

interface IFormInputs {
  email: string;
  password: string;
  password_confirmation: string;
}

const schema = yup.object().shape({
  email: yup.string().required('Email obrigatório'),
  password: yup.string().required('Senha obrigatória'),
  password_confirmation: yup.string().required('Confirmação de senha obrigatória').oneOf(
    [yup.ref('password'), undefined],
    'Confirmação Incorreta',
  ),
});

export function ResetPassword() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState:{ errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: IFormInputs) => {
    try {
      await api.post('/password/reset', data);
      navigate('/signin');
    } catch (error) {
      alert('Ocorreu algum erro ao trocar a senha. Tente novamente mais tarde...')
    }
  };

  return (
    <div className={styles.container}>
      <HeaderFlow />

      <div className={styles.content}>
        <div className={styles.resetPassword}>
          <NavLink to="/">
            <img src={logo} alt="" />
          </NavLink>

          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Resetar Senha</h1>

            <div>
              <InputField
                icon={EnvelopeSimple}
                placeholder="Seu Email"
                errorMessage={errors.email?.message}
                register={register('email')}
              />

              <InputField
                icon={LockOpen}
                type="password"
                placeholder="Nova Senha"
                errorMessage={errors.password?.message}
                register={register('password')}
              />

              <InputField
                icon={Lock}
                type="password"
                placeholder="Confirmação de Senha"
                errorMessage={errors.password_confirmation?.message}
                register={register('password_confirmation')}
              />
            </div>

            <button type="submit">Alterar Senha</button>
          </form>

          <Link to="/signin" className={styles.signin}>
            <SignOut />
            Voltar para Logon
          </Link>
        </div>

        <div className={styles.image}>
          <img
            src={resetPasswordImg}
            title="Autor: Iryna Zaichenko"
            aria-label="Autor: Iryna Zaichenko"
            alt="Cão com pelagem amarela e branca"
          />
          <a
            href="https://thumbs.dreamstime.com/b/hound-istriano-istarski-kratkodlaki-%E2%80%94-ilustra%C3%A7%C3%A3o-digital-de-arte-can%C3%B4nica-isolada-em-fundo-branco-origem-croata-cro%C3%A1cia-253964504.jpg"
            target="_blank"
          >
            Iryna Zaichenko
          </a>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>© Copyright FoundLostPet 2022</span>
      </footer>
    </div>
  );
}