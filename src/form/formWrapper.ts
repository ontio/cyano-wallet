/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The ONT Detective.
 *
 * The ONT Detective is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The ONT Detective is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The ONT Detective.  If not, see <http://www.gnu.org/licenses/>.
 */

import { get } from 'lodash';
import { FieldRenderProps, FormRenderProps } from 'react-final-form';
import { compose, mapProps } from 'recompose';
import { Form as SemanticForm, FormFieldProps, FormProps } from 'semantic-ui-react';

export const  FieldWrapper = compose<FormFieldProps, FieldRenderProps>(
  mapProps<FormFieldProps, FieldRenderProps>((outer) => ({
    ...outer,
    error: outer.meta.touched && outer.meta.invalid,
    input: {
      ...outer.input,
      value: outer.input.value
    },
    meta: undefined,
    onChange: outer.input.onChange
  }))
);

export const InputField = FieldWrapper(SemanticForm.Input);
export const TextareaField = FieldWrapper(SemanticForm.TextArea);

export const  FormWrapper = compose<FormProps, FormRenderProps>(
  mapProps<FormProps, FormRenderProps>((outer) => ({
    children: get(outer, 'children'),
    error: outer.submitFailed,
    onSubmit: outer.handleSubmit,
  }))
);

export const Form = FormWrapper(SemanticForm);
