import type { ForwardRefRenderFunction } from 'react';
import { forwardRef, useMemo } from 'react';

import { type Locale, parse } from 'date-fns';
import formatISO from 'date-fns/formatISO';
import { type FieldProps } from 'formik';

import { type Input } from '@proton/atoms';
import { DateInputTwo, InputFieldTwo } from '@proton/components';
import { type InputFieldProps } from '@proton/components/components/v2/field/InputField';
import { useFieldControl } from '@proton/pass/hooks/useFieldControl';
import { type Maybe } from '@proton/pass/types/utils';
import { formatPlaceholder } from '@proton/pass/utils/time/format';
import clsx from '@proton/utils/clsx';

export type Props = FieldProps<string> & InputFieldProps<typeof Input>;

const DATE_FORMATS = ['PP', 'P'];

const handleInput = (value: string, locale: Locale) => {
    for (const format of DATE_FORMATS) {
        try {
            const parsed = parse(value, format, new Date(), { locale });
            if (!isNaN(parsed.getTime())) return parsed;
        } catch {}
    }

    return new Date();
};

const DateFieldRender: ForwardRefRenderFunction<HTMLInputElement, Props> = (
    { field, form, meta, inputClassName, labelContainerClassName, placeholder, disabled },
    ref
) => {
    const { value, onChange } = field;
    const { error } = useFieldControl({ field, form, meta });

    const formattedPlaceholder = useMemo(formatPlaceholder, []);

    const dateValue = useMemo<Maybe<Date>>(() => {
        if (value) {
            const date = new Date(value);
            if (isFinite(date.getTime())) return date;
        }
    }, [value]);

    const handleDateChange = (date: Maybe<Date>): void => {
        const stringValue = date ? formatISO(date).split('T')[0] : '';
        onChange?.(stringValue);
    };

    return (
        <InputFieldTwo
            as={DateInputTwo}
            unstyled
            placeholder={placeholder ?? formattedPlaceholder}
            assistContainerClassName="empty:hidden"
            error={error}
            inputClassName={clsx('p-0 rounded-none', disabled ? 'color-disabled' : 'color-norm', inputClassName)}
            labelContainerClassName={clsx(
                'm-0 text-normal text-sm',
                error ? 'color-danger' : 'color-weak',
                labelContainerClassName
            )}
            onChange={handleDateChange}
            ref={ref}
            value={dateValue}
            fromFormatter={handleInput}
        />
    );
};

export const DateField = forwardRef(DateFieldRender);
