import LockIcon from '@mui/icons-material/Lock'
import MenuIcon from '@mui/icons-material/Menu'
import { Button, IconButton, Stack, Typography, alpha } from '@mui/material'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthModal from '../auth'
import CollapsableMenu from './CollapsableMenu'
import { ButtonContainer, CustomDrawer } from './Navbar.style'

import { setWelcomeModal } from '@/redux/slices/utils'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { CategoryApi } from '../../hooks/react-query/config/categoryApi'
import { RestaurantsApi } from '../../hooks/react-query/config/restaurantApi'
import { useGetCuisines } from '../../hooks/react-query/cuisines/useGetCuisines'
import { setClearCart } from '../../redux/slices/cart'
import {
    setCuisines,
    setFeaturedCategories,
} from '../../redux/slices/storedData'
import { removeToken } from '../../redux/slices/userToken'
import { clearWishList } from '../../redux/slices/wishList'
import {
    CustomLink,
    CustomStackFullWidth,
} from '../../styled-components/CustomStyles.style'
import { logoutSuccessFull } from '../../utils/ToasterMessages'
// import CustomLanguage from '../CustomLanguage'
import { onErrorResponse } from '../ErrorResponse'
import { RTL } from '../RTL/RTL'
import { getToken } from '../checkout-page/functions/getGuestUserId'
import { CustomTypography } from '../custom-tables/Tables.style'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import ThemeSwitches from './top-navbar/ThemeSwitches'
import { removeCookie } from '@/utils/cookies'
import { setlocation } from '@/redux/slices/addressData'
import { setIsLoading } from '@/redux/slices/global'

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const DrawerMenu = ({  cartListRefetch }) => {
    const [forSignup, setForSignup] = useState('')
    const [modalFor, setModalFor] = useState('sign-in')
    const { featuredCategories, cuisines } = useSelector(
        (state) => state.storedData
    )
    const { countryCode, language } = useSelector(
        (state) => state.languageChange
    )
    const { t } = useTranslation()
    const router = useRouter()
    const dispatch = useDispatch()
    const [openDrawer, setOpenDrawer] = useState(false)
    const token = getToken()
    const [authModalOpen, setOpen] = useState(false)
    const handleOpenAuthModal = (page) => {
        setModalFor(page)
        setOpen(true)
        setForSignup(page)
    }

    const handleCloseAuthModal = () => {
        setOpen(false)
        setForSignup('sign-in')
    }

    const handleLogout = async () => {
        try {
            dispatch(setIsLoading(true));
            await localStorage.removeItem('token')
            removeCookie('token')
            dispatch(setlocation(null))
            dispatch(removeToken())
            setOpenDrawer(false)
            let a = []
            dispatch(clearWishList(a))
            dispatch(setClearCart())
            dispatch(setWelcomeModal(false))
            dispatch(setIsLoading(false));
            CustomToaster('success', logoutSuccessFull)
            router.push('/login')
        } catch (err) {
            dispatch(setIsLoading(false));

        }
    }

    const toggleDrawer = (openDrawer) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }
        setOpenDrawer(openDrawer)
    }
    const searchKey = ''

    const {
        isLoading,
        data: categoryData,
        isError,
        error,
        refetch: categoryApiRefetch,
    } = useQuery(['category'], () => CategoryApi.categories(searchKey), {
        enabled: false,
        staleTime: 1000 * 60 * 8,
        onError: onErrorResponse,
        cacheTime: 8 * 60 * 1000,
    })
    const {
        isLoading: vegLoading,
        data: popularRestuarants,
        isError: vegIsError,
        error: vegError,
        refetch: restaurantApiRefetch,
    } = useQuery(
        ['restaurants/popular'],
        () => RestaurantsApi?.popularRestaurants(),
        { enabled: false }
    )
   

    const { data, refetch, isRefetching } = useGetCuisines()
    useEffect(() => {
        if (cuisines?.length === 0) {
            refetch()
        }
    }, [])

    useEffect(() => {
        if (categoryData) {
            dispatch(setFeaturedCategories(categoryData?.data))
        }
        if (data) {
            dispatch(setCuisines(data?.Cuisines))
        }
    }, [categoryData, data])
    const collapsableMenu = {
        cat: {
            text: 'Categories',
            items: featuredCategories?.map((item) => item),
            path: '/category',
        },
        res: {
            text: 'Restaurants',
            items: popularRestuarants?.data?.map((i) => i),
            path: '/restaurant',
        },
        cuisine: {
            text: 'Cuisines',
            items: cuisines?.map((i) => i),
            path: '/cuisines',
        },
        profile: {
            text: 'Profile',
        },
    }
    let location = undefined
    if (typeof window !== 'undefined') {
        location = localStorage.getItem('location')
    }
    let languageDirection = undefined
    if (typeof window !== 'undefined') {
        languageDirection = localStorage.getItem('direction')
    }

    const handleRoute = (path) => {
        router.push(`/${path}`)
        setOpenDrawer(false)
    }
    const handleRouteToUserInfo = () => {
        Router.push(
            {
                pathname: '/info',
                query: { page: 'profile' },
            },
            undefined,
            { shallow: true }
        )
        setOpenDrawer(false)
    }
    const menuList = () => (
        <RTL direction={languageDirection ? languageDirection : 'ltr'}>
            <Box
                sx={{ width: 'auto', paddingInline: '10px', height: '100%' }}
                role="presentation"
                onKeyDown={toggleDrawer(false)}
            >
                <Stack height="100%">
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        <ListItemButton
                            sx={{
                                marginTop: location ? '20px' : '10px',
                                borderBottom: location && '1px solid',
                                borderBottomColor: (theme) =>
                                    alpha(theme.palette.neutral[300], 0.3),
                            }}
                        >
                            {location && (
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {t('Home')}
                                        </Typography>
                                    }
                                    onClick={() => handleRoute('/home')}
                                />
                            )}
                        </ListItemButton>

                        {location && (
                            <>
                                <CollapsableMenu
                                    value={collapsableMenu.cat}
                                    setOpenDrawer={setOpenDrawer}
                                    toggleDrawers={toggleDrawer}
                                    pathName="/categories"
                                />
                                <CollapsableMenu
                                    value={collapsableMenu.res}
                                    setOpenDrawer={setOpenDrawer}
                                    toggleDrawers={toggleDrawer}
                                    pathName="/restaurant"
                                />
                                <CollapsableMenu
                                    value={collapsableMenu.cuisine}
                                    setOpenDrawer={setOpenDrawer}
                                    toggleDrawers={toggleDrawer}
                                    pathName="/cuisines"
                                />
                                {/*<CollapsableMenu value={collapsableMenu.profile} setOpenDrawer={setOpenDrawer} toggleDrawers={toggleDrawer}/>*/}
                                <ListItemButton
                                    sx={{
                                        borderBottom: '1px solid',
                                        borderBottomColor: (theme) =>
                                            alpha(
                                                theme.palette.neutral[300],
                                                0.3
                                            ),
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                sx={{ fontSize: '12px' }}
                                            >
                                                {t('Profile')}
                                            </Typography>
                                        }
                                        onClick={handleRouteToUserInfo}
                                    />
                                </ListItemButton>
                            </>
                        )}

                        <ListItemButton
                            sx={{
                                borderBottom: '1px solid',
                                borderBottomColor: (theme) =>
                                    alpha(theme.palette.neutral[300], 0.3),
                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: '12px' }}>
                                        {t('Terms & Conditions')}
                                    </Typography>
                                }
                                onClick={() =>
                                    handleRoute('terms-and-conditions')
                                }
                            />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                borderBottom: '1px solid',
                                borderBottomColor: (theme) =>
                                    alpha(theme.palette.neutral[300], 0.3),

                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: '12px' }}>
                                        {t('Privacy Policy')}
                                    </Typography>
                                }
                                onClick={() => handleRoute('privacy-policy')}
                            />
                        </ListItemButton>

                        <ListItemButton
                            sx={{
                                borderBottom: '1px solid',
                                borderBottomColor: (theme) =>
                                    alpha(theme.palette.neutral[300], 0.3),

                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: '12px' }}>
                                        {t('My Cart')}
                                    </Typography>
                                }
                                onClick={() => handleRoute('privacy-policy')}
                            />
                        </ListItemButton>

                        
                       
                        
                    </List>

                    <ButtonContainer>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, mb: 1, borderRadius: '5px' }}
                            onClick={() => handleLogout()}
                        >
                            {t('Logout')}
                        </Button>
                    </ButtonContainer>
                </Stack>
            </Box>
        </RTL>
    )

    const withOutLogin = () => (
        <RTL direction={languageDirection}>
            <Box
                sx={{ width: 'auto', paddingInline: '10px', height: '100%' }}
                role="presentation"
                onKeyDown={toggleDrawer(false)}
            >
                <Stack height="100%">
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        <>
                            <ListItemButton
                                sx={{
                                    marginTop: location ? '20px' : '10px',
                                    borderBottom: location && '1px solid',
                                    borderBottomColor: (theme) =>
                                        alpha(theme.palette.neutral[300], 0.3),
                                }}
                            >
                                {location && (
                                    <ListItemText
                                        primary={
                                            <Typography
                                                sx={{ fontSize: '12px' }}
                                            >
                                                {t('Home')}
                                            </Typography>
                                        }
                                        onClick={() => handleRoute('/home')}
                                    />
                                )}
                            </ListItemButton>
                            {location && (
                                <>
                                    <CollapsableMenu
                                        value={collapsableMenu.cat}
                                        setOpenDrawer={setOpenDrawer}
                                        toggleDrawers={toggleDrawer}
                                        pathName="/categories"
                                    />
                                    <CollapsableMenu
                                        value={collapsableMenu.res}
                                        setOpenDrawer={setOpenDrawer}
                                        toggleDrawers={toggleDrawer}
                                        pathName="/restaurant"
                                    />
                                    <CollapsableMenu
                                        value={collapsableMenu.cuisine}
                                        setOpenDrawer={setOpenDrawer}
                                        toggleDrawers={toggleDrawer}
                                        pathName="/cuisines"
                                    />
                                </>
                            )}

                            <ListItemButton
                                sx={{
                                    borderBottom: '1px solid',
                                    borderBottomColor: (theme) =>
                                        alpha(theme.palette.neutral[300], 0.3),
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {t('Terms & Conditions')}
                                        </Typography>
                                    }
                                    onClick={() =>
                                        handleRoute('terms-and-conditions')
                                    }
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{
                                    borderBottom: '1px solid',
                                    borderBottomColor: (theme) =>
                                        alpha(theme.palette.neutral[300], 0.3),
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {t('Privacy Policy')}
                                        </Typography>
                                    }
                                    onClick={() =>
                                        handleRoute('privacy-policy')
                                    }
                                />
                            </ListItemButton>
                            
                            <ListItemButton>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {t('Language')}
                                        </Typography>
                                    }
                                />
                                {/* <CustomLanguage
                                    countryCode={countryCode}
                                    language={language}
                                    isMobile={true}
                                /> */}
                            </ListItemButton>
                        </>
                    </List>
                    <ButtonContainer marginBottom="50px">
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 0, mb: 1, borderRadius: '5px' }}
                            startIcon={<LockIcon />}
                            onClick={() => handleOpenAuthModal('sign-in')}
                            //  onClick={() => setLogin(true)}
                        >
                            {t('Sign In')}
                        </Button>
                        <CustomStackFullWidth
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={0.5}
                            marginTop="1rem"
                        >
                            <CustomTypography fontSize="14px">
                                {t("Don't have an account?")}
                            </CustomTypography>
                            <CustomLink
                                onClick={() => {
                                    handleOpenAuthModal('sign-up')
                                }}
                                variant="body2"
                            >
                                {t('Sign Up')}
                            </CustomLink>
                        </CustomStackFullWidth>
                    </ButtonContainer>
                </Stack>
            </Box>
        </RTL>
    )

    return (
        <Box>
            {authModalOpen && (
                <AuthModal
                    open={authModalOpen}
                    handleClose={handleCloseAuthModal}
                    forSignup={forSignup}
                    modalFor={modalFor}
                    setModalFor={setModalFor}
                    cartListRefetch={cartListRefetch}
                />
            )}
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(!openDrawer)}
                sx={{
                    color: (theme) => theme.palette.primary.main,
                    paddingRight: '0px',
                    paddingLeft: languageDirection === 'rtl' && '0px',
                }}
            >
                <MenuIcon />
            </IconButton>
            <RTL direction={languageDirection}>
                <CustomDrawer
                    anchor="right"
                    open={openDrawer}
                    onClose={toggleDrawer(false)}
                >
                    {token ? menuList() : withOutLogin()}
                </CustomDrawer>
            </RTL>
            {/* <AuthModal/> */}
        </Box>
    )
}

export default DrawerMenu
