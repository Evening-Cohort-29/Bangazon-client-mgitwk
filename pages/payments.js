import Link from 'next/link'
import { useState, useEffect } from 'react'
import CardLayout from '../components/card-layout'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import AddPaymentModal from '../components/payments/payment-modal'
import Table from '../components/table'
import { addPaymentType, getPaymentTypes, deletePaymentType } from '../data/payment-types'
import { useAppContext } from '../context/state'
import { getUserProfile } from '../data/auth'

export default function Payments() {
  const {profile, setProfile} = useAppContext()

  const headers = ['Merchant Name', 'Expiration Date', '']
  // const [payments, setPayments] = useState([])
  const [showModal, setShowModal] = useState(false)
  // const refresh = () => getPaymentTypes().then((data) => {
  //   if (data) {
  //     setPayments(data)
  //   }
  // })

  useEffect(() => {
    getUserProfile().then((profileData) => {
      if (profileData) {
        setProfile(profileData)
      }
    })
  }, [])

  // useEffect(() => {
  //     refresh()
  // }, [])

  const addNewPayment = (payment) => {
    addPaymentType(payment).then(() => {
      setShowModal(false)
      refresh()
    })
  }

  const removePayment = (paymentId) => {
    deletePaymentType(paymentId).then(() => {
      refresh()
    })
  }

  return (
    <>
      {profile?.payment_types?.[0] ?
      <>
      <AddPaymentModal showModal={showModal} setShowModal={setShowModal} addNewPayment={addNewPayment} />
      <CardLayout title="Your Payment Methods">
        <Table headers={headers}>
          {
            profile?.payment_types?.map(payment => (

              <tr key={payment?.id}>
                <td>{payment?.merchant_name}</td>
                <td>{payment?.expiration_date}</td>
                <td>
                  <span className="icon is-clickable" onClick={() => removePayment(payment.id)}>
                    <i className="fas fa-trash"></i>
                  </span>
                </td>
              </tr>
            ))
          }
        </Table>
        <>
          <a className="card-footer-item" onClick={() => setShowModal(true)}>Add new Payment Method</a>
        </>
      </CardLayout>
      </>
      :
      <>
      <a className="card-footer-item" onClick={() => setShowModal(true)}>Add new Payment Method</a>
      </>
      }
    </>
  )
}

Payments.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  )
}
