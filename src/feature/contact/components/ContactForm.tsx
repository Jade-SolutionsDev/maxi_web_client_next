'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheckBig, Send } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/app/components/form/Form';
import { FormInput } from '@/app/components/form/FormInput';
import { FormSelect } from '@/app/components/form/FormSelect';
import { FormTextarea } from '@/app/components/form/FormTextarea';
import { Button } from '@/app/components/ui/button';
import { submitContactMessage } from '../action/contact.action';
import {
  ContactFormSchema,
  type ContactFormValues,
} from '../schema/contact.schema';
import type { ContactFailure, ContactMotive } from '../type/contact.interface';

const FAILURE_MESSAGE: Record<ContactFailure['kind'], string> = {
  invalid: 'Revisá los datos del formulario e intentá de nuevo.',
  'rate-limited': 'Enviaste varios mensajes seguidos. Esperá un minuto.',
  unknown: 'No pudimos enviar tu mensaje. Intentá de nuevo.',
};

const emptyValues = (anonymous: boolean): ContactFormValues => ({
  motiveId: '',
  message: '',
  website: '',
  anonymous,
  name: '',
  lastName: '',
  email: '',
  phone: '',
});

type ContactFormProps = {
  motives: ContactMotive[];
  isSignedIn: boolean;
};

export const ContactForm = ({ motives, isSignedIn }: ContactFormProps) => {
  'use no memo';

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: emptyValues(!isSignedIn),
  });
  const [failure, setFailure] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const motiveOptions = motives.map((motive) => ({
    value: motive.id,
    label: motive.label,
  }));

  const onSubmit = (values: ContactFormValues) => {
    setFailure(null);
    startTransition(async () => {
      const result = await submitContactMessage(values);
      if ('failure' in result) {
        setFailure(FAILURE_MESSAGE[result.failure.kind]);
        return;
      }
      setSent(true);
    });
  };

  if (sent) {
    return (
      <div className='rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm'>
        <span className='mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15 text-total'>
          <CircleCheckBig className='size-7' aria-hidden='true' />
        </span>
        <h3 className='mt-4 text-xl font-bold text-heading'>
          ¡Mensaje enviado!
        </h3>
        <p className='mt-2 text-sm text-muted'>
          Gracias por escribirnos. Nuestro equipo te responderá lo antes
          posible.
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8'>
      <Form form={form} onSubmit={onSubmit}>
        {failure && (
          <p role='alert' className='text-sm text-destructive'>
            {failure}
          </p>
        )}

        <FormSelect
          name='motiveId'
          label='Motivo'
          placeholder='Elige un motivo'
          options={motiveOptions}
          required
        />

        {!isSignedIn && (
          <>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormInput
                name='name'
                label='Nombre'
                placeholder='Ana'
                required
              />
              <FormInput
                name='lastName'
                label='Apellidos'
                placeholder='Pérez García'
                required
              />
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormInput
                name='email'
                type='email'
                label='Correo'
                placeholder='ana@ejemplo.com'
              />
              <FormInput
                name='phone'
                type='tel'
                label='Teléfono'
                placeholder='+53 5 123 4567'
              />
            </div>
            <p className='text-xs text-muted'>
              Dejanos al menos un correo o un teléfono para poder responderte.
            </p>
          </>
        )}

        {isSignedIn && (
          <p className='text-xs text-muted'>
            Te responderemos con los datos de contacto de tu cuenta.
          </p>
        )}

        <FormTextarea
          name='message'
          label='Mensaje'
          rows={6}
          placeholder='Contanos en qué podemos ayudarte…'
          required
        />

        <div aria-hidden='true' className='sr-only'>
          <label htmlFor='contact-website'>No completar este campo</label>
          <input
            id='contact-website'
            type='text'
            tabIndex={-1}
            autoComplete='off'
            {...form.register('website')}
          />
        </div>

        <Button type='submit' size='lg' loading={isPending} className='gap-2'>
          <Send className='size-4' aria-hidden='true' />
          Enviar mensaje
        </Button>
      </Form>
    </div>
  );
};
