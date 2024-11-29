import React, { memo, useState } from 'react'
import { PrimaryButton } from '@/components/products-page/FoodOrRestaurant'
import { Stack } from '@mui/system'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { Avatar, Typography } from '@mui/material'
// import  Accessibility  from '@mui/icons-material'
import { t } from 'i18next'
import { useTheme } from '@mui/styles'
import {
    CustomButtonCancel,
    CustomButtonSuccess,
} from '@/styled-components/CustomButtons.style'
import { useSelector } from 'react-redux'

const ExitingUser = ({
    setModalFor,
    formSubmitHandler,
    userInfo,
    loginIsLoading,
    loginInfo,
}) => {
    const [isYes, setIsYes] = useState(null)
    const theme = useTheme()
    const { global } = useSelector((state) => state.globalSettings)
    const postNewUser = (value) => {
        setIsYes(value)
        formSubmitHandler(value)
    }

    return (
        <CustomStackFullWidth spacing={3}>
            <CustomStackFullWidth alignItems="center">
                <Avatar
                    src={`${loginInfo?.is_exist_user?.image}/${global?.base_urls?.customer_image_url}`}
                />
                <Typography fontSize="14px">
                    {loginInfo?.is_exist_user?.name}
                </Typography>
            </CustomStackFullWidth>
            <CustomStackFullWidth alignItems="center" spacing={1}>
                <Typography>{t('Is It You?')}</Typography>
                <Typography
                    textAlign="center"
                    fontSize="14px"
                    color={theme.palette.text.secondary}
                >
                    {t(
                        'It looks like the email you entered has already been used and has an existing account.'
                    )}
                </Typography>
            </CustomStackFullWidth>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                width="100%"
                spacing={{ xs: 1, sm: 2, md: 3 }}
            >
                <CustomButtonCancel
                    variant="contained"
                    onClick={() => postNewUser('no')}
                >
                    {t('No')}
                </CustomButtonCancel>
                <CustomButtonSuccess
                    loading={isYes === 'yes' && loginIsLoading}
                    variant="contained"
                    onClick={() => postNewUser('yes')}
                >
                    {t('Yes')}
                </CustomButtonSuccess>
            </Stack>
        </CustomStackFullWidth>
    )
}

export default memo(ExitingUser)