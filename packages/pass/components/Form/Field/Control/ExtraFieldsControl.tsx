import { type FC, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { getExtraFieldOption } from '@proton/pass/components/Form/Field/ExtraFieldGroup/ExtraField';
import { FieldsetCluster } from '@proton/pass/components/Form/Field/Layout/FieldsetCluster';
import { TextAreaReadonly } from '@proton/pass/components/Form/legacy/TextAreaReadonly';
import { UpsellRef } from '@proton/pass/constants';
import { selectExtraFieldLimits } from '@proton/pass/store/selectors';
import type { DeobfuscatedItemExtraField } from '@proton/pass/types';
import { isEmptyString } from '@proton/pass/utils/string/is-empty-string';
import { formatTimestamp } from '@proton/pass/utils/time/format';

import { OTPValueControl } from './OTPValueControl';
import { UpgradeControl } from './UpgradeControl';
import { ValueControl } from './ValueControl';

type ExtraFieldsControlProps = {
    extraFields: DeobfuscatedItemExtraField[];
    itemId: string;
    shareId: string;
    onCopy?: () => void;
};

export const ExtraFieldsControl: FC<ExtraFieldsControlProps> = ({ extraFields, itemId, shareId, onCopy }) => {
    const { needsUpgrade } = useSelector(selectExtraFieldLimits);

    const getControlByType = useCallback(
        ({ fieldName, type, data }: DeobfuscatedItemExtraField, index: number) => {
            const { icon } = getExtraFieldOption(type);
            const key = `${index}-${fieldName}`;

            if (needsUpgrade) {
                return (
                    <UpgradeControl icon={icon} key={key} label={fieldName} upsellRef={UpsellRef.LIMIT_EXTRA_FIELD} />
                );
            }

            switch (type) {
                case 'totp':
                    return isEmptyString(data.totpUri) ? (
                        <ValueControl icon={icon} key={key} label={fieldName} />
                    ) : (
                        <OTPValueControl
                            key={key}
                            label={fieldName}
                            payload={{ totpUri: data.totpUri, type: 'uri' }}
                            onCopy={onCopy}
                        />
                    );
                case 'timestamp':
                    return isEmptyString(data.timestamp) ? (
                        <ValueControl icon={icon} key={key} label={fieldName} />
                    ) : (
                        <ValueControl
                            clickToCopy
                            as={TextAreaReadonly}
                            key={key}
                            icon={icon}
                            label={fieldName}
                            value={formatTimestamp(data.timestamp)}
                            onCopy={onCopy}
                        />
                    );
                case 'hidden':
                case 'text':
                    return isEmptyString(data.content) ? (
                        <ValueControl icon={icon} key={key} label={fieldName} />
                    ) : (
                        <ValueControl
                            clickToCopy
                            as={TextAreaReadonly}
                            key={key}
                            hidden={type === 'hidden'}
                            icon={icon}
                            label={fieldName}
                            value={data.content}
                            onCopy={onCopy}
                        />
                    );
            }
        },
        [itemId, shareId]
    );

    return (
        <FieldsetCluster mode="read" as="div">
            {extraFields.map((extraField, index) => getControlByType(extraField, index))}
        </FieldsetCluster>
    );
};
