import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import { getImageUrl } from '../../utils/helpers';
import workspaceService from '../../services/workspaceService';

import PageHeader from '../../components/layout/PageHeader';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';


export default function WorkspacePlaces() {

    const { id } = useParams();
    const navigate = useNavigate();


    const [places, setPlaces] = useState([]);
    const [current, setCurrent] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');



    useEffect(() => {

        const fetchPlaces = async () => {

            try {

                const data =
                    await workspaceService.getWorkspacePlaces(id);


                setPlaces(data.places ?? []);


            } catch (err) {

                setError(
                    err.response?.data?.message ??
                    'Failed to load places.'
                );

            } finally {

                setLoading(false);

            }

        };


        fetchPlaces();

    }, [id]);



    if (loading) {
        return <Loading />;
    }



    if (places.length === 0) {

        return (

            <div>

                <PageHeader
                    title="Workspace Places"
                    subtitle="Places included in this trip."
                />

                <p className="text-gray-500">
                    No places added yet.
                </p>

            </div>

        );

    }



    const placeItem = places[current];

    const place = placeItem.place;



    const next = () => {

        setCurrent(
            (prev) =>
                (prev + 1) % places.length
        );

    };


    const previous = () => {

        setCurrent(
            (prev) =>
                prev === 0
                    ? places.length - 1
                    : prev - 1
        );

    };



    return (

        <div>


            <PageHeader
                title={(
                    <>
                        <HiOutlineLocationMarker className="inline-block mr-3 text-3xl text-rose-600 align-middle" />
                        Workspace Places
                    </>
                )}
                subtitle="Explore places included in this workspace."
            />


            <ErrorMessage message={error} />



            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">


                <div className="flex flex-col gap-6 md:flex-row">


                    {/* Image */}


                    <div className="md:w-1/2">

                        <div className="relative">
                            <img
                                src={getImageUrl(
                                    place.main_image ??
                                    place.image_url ??
                                    place.images?.[0]?.url ??
                                    place.images?.[0]?.image_url ??
                                    '/images/no-image.png'
                                )}
                                alt={place.name}
                                className="h-72 w-full rounded-xl object-cover"
                                onError={(event) => {
                                    event.currentTarget.src = '/images/no-image.png';
                                }}
                            />

                            <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-gray-800">
                                {place.city ?? ''}
                            </div>
                        </div>

                    </div>




                    {/* Information */}


                    <div className="flex flex-1 flex-col justify-center">


                        <h2 className="text-2xl font-bold text-gray-800">

                            {place.name}

                        </h2>



                        <p className="mt-4 text-gray-600">

                            {place.description ??
                            'No description available.'}

                        </p>



                        <div className="mt-5 space-y-2 text-sm text-gray-700">


                            {place.category && (

                                <p>
                                    <strong>
                                    Category:
                                    </strong>
                                    {' '}
                                    {place.category}
                                </p>

                            )}



                            {place.city && (

                                <p>
                                    <strong>
                                    City:
                                    </strong>
                                    {' '}
                                    {place.city.name}
                                </p>

                            )}


                        </div>


                    </div>


                </div>





                {/* Slider Controls */}


                <div className="mt-8 flex items-center justify-between">


                    <Button
                        variant="secondary"
                        onClick={previous}
                    >
                        ← Previous
                    </Button>



                    <span className="text-sm text-gray-500">

                        {current + 1}
                        {' / '}
                        {places.length}

                    </span>



                    <Button
                        onClick={next}
                    >
                        Next →
                    </Button>


                </div>



            </div>




            <div className="mt-6">

                <Button
                    variant="secondary"
                    onClick={() =>
                        navigate(`/workspaces/${id}`)
                    }
                >
                    Back to Workspace
                </Button>

            </div>


        </div>

    );

}
