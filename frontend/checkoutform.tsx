
import React, {useState} from "react";
import axios from 'axios';
import {useForm} from 'react-hook-form';
import Input from '@components/ui/input';
import Button from '@components/ui/button';
import jwt from 'jsonwebtoken';
import {useCart} from '@contexts/cart/cart.context';
import {useRouter} from "next/router";
// This is a sample file that shows how to call the CF İyzico payment gateway from the frontend.

interface CheckoutInputType {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    identityNumber: number;
}

const CheckoutForm: React.FC = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<CheckoutInputType>();
    const {items, total} = useCart();
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const onStartPaymentSubmit = async (input: CheckoutInputType) => {
        setIsPending(true);
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Authentication token is not found.');

            setIsPending(false);
            return;
        }

        const decodedToken = jwt.decode(token);
        if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.id) {
            console.error('User is not logged in');
            setIsPending(false);
            return;
        }

        const orderDetails = {
            user: decodedToken.id,
            products: items.map(item => ({
                product: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
            total,
            shipping_fee: 0,
            address: input,
        };

        try {
            const orderResponse = await axios.post('YOUR_ORDER_API_URL', orderDetails, {
                headers: {Authorization: `Bearer ${token}`},
            });
            console.log('Order response:', orderResponse.data);

            if (!orderResponse.data || !orderResponse.data._id) {
                throw new Error('Failed to create order.');
            }
// you need to send the order details to the backend to create an order and get the payment initialization URL.
            const checkoutFormInitializeResponse = await axios.post('YOUR_PAYMENT_INITIALIZATION_API_URL', {
                total: total,
                buyer: {
                    id: decodedToken.id,
                    name: input.firstName,
                    surname: input.lastName,
                    gsmNumber: input.phone,
                    email: input.email,
                    identityNumber: input.identityNumber,
                    registrationAddress: input.address,
                    city: input.city,
                    country: 'Turkey',
                    zipCode: input.zipCode
                },
                shippingAddress: {
                    address: input.address,
                    zipCode: input.zipCode,
                    contactName: input.firstName + ' ' + input.lastName,
                    city: input.city,
                    country: 'Turkey'
                },
                billingAddress: {
                    address: input.address,
                    zipCode: input.zipCode,
                    contactName: input.firstName + ' ' + input.lastName,
                    city: input.city,
                    country: 'Turkey'
                },
                basketItems: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    category1: item.category,
                    category2: item.category,
                    itemType: 'PHYSICAL',
                    price: item.price
                }))
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },

            });
            console.log('Checkout form initialize response:', checkoutFormInitializeResponse.data);

            if (checkoutFormInitializeResponse.data && checkoutFormInitializeResponse.data.status === 'success') {
                console.log('paymentPageUrl exists:', 'paymentPageUrl' in checkoutFormInitializeResponse.data);
                console.log('paymentPageUrl:', checkoutFormInitializeResponse.data.paymentPageUrl);

                localStorage.setItem('paymentPageUrl', checkoutFormInitializeResponse.data.paymentPageUrl);

                router.push({
                    pathname: '/iyzico',
                });
            } else {
                console.error('Payment initialization error:', checkoutFormInitializeResponse.data);
            }
        } catch (error) {
            console.error('Payment error:', error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
                {'Kargo Adresi'}
            </h2>
            <form
                className="w-full mx-auto flex flex-col justify-center "
                noValidate
                onSubmit={handleSubmit(onStartPaymentSubmit)}
            >
                <div className="flex flex-col space-y-4 lg:space-y-5">
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
                        <Input
                            labelKey="İsim"
                            {...register('firstName', {
                                required: 'İsim gerekli',
                            })}
                            errorKey={errors.firstName?.message}
                            variant="solid"
                            className="w-full lg:w-1/2 "
                        />
                        <Input
                            labelKey="Soyisim"
                            {...register('lastName', {
                                required: 'Soyisim gerekli',
                            })}
                            errorKey={errors.lastName?.message}
                            variant="solid"
                            className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
                        />
                    </div>

                    <Input
                        labelKey="Adres"
                        {...register('address', {
                            required: 'Adres gerekli',
                        })}
                        errorKey={errors.address?.message}
                        variant="solid"
                    />
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
                        <Input
                            type="tel"
                            labelKey="Telefon"
                            {...register('phone', {
                                required: 'Telefon numarası gerekli',
                            })}
                            errorKey={errors.phone?.message}
                            variant="solid"
                            className="w-full lg:w-1/2 "
                        />

                        <Input
                            type="email"
                            labelKey="E-posta *"
                            {...register('email', {
                                required: 'E-posta gerekli',
                                pattern: {
                                    value:
                                        /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/,
                                    message: 'Geçersiz e-posta adresi',
                                },
                            })}
                            errorKey={errors.email?.message}
                            variant="solid"
                            className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
                        <Input
                            labelKey="Şehir"
                            {...register('city')}
                            variant="solid"
                            className="w-full lg:w-1/2 "
                        />

                        <Input
                            labelKey="Posta Kodu"
                            {...register('zipCode')}
                            variant="solid"
                            className="w-full lg:w-1/2 ltr:lg:ml-3 rtl:lg:mr-3 mt-2 md:mt-0"
                        />

                    </div>
                    <Input
                        labelKey="Kimlik Numarası"
                        {...register('identityNumber', {
                            required: 'Kimlik numarası gerekli',
                        })}
                        errorKey={errors.identityNumber?.message}
                        variant="solid"
                    />
                    <div className="flex w-full">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            disabled={isPending}
                        >
                            {isPending ? 'Ödeme Formuna Yönlendiriliyor...Lütfen Bekleyiniz' : 'Taksitle Öde'}
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CheckoutForm;