'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Plus, Users, TrendingUp, DollarSign,
  Mail, Phone, Briefcase, Calendar, Filter, X,
  BarChart3, UserCheck, Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type Client = {
  id: string
  nom: string
  email: string
  telephone: string
  entreprise: string
  service: string
  statut: 'Prospect' | 'En cours' | 'Client' | 'Perdu'
  valeur: number
  dateAjout: string
  derniereInteraction: string
}

const services = ['Site Web', 'Logo + Branding', 'Gestion Réseaux', 'Publicité Meta', 'Application Mobile']
const statuts = ['Prospect', 'En cours', 'Client', 'Perdu']

const initialClients: Client[] = [
  { id: '1', nom: 'Mukendi Sarah', email: 'sarah@boutique.cd', telephone: '+243 81X XXX', entreprise: 'Boutique Sarah', service: 'Site Web', statut: 'Client', valeur: 450, dateAjout: '2026-01-15', derniereInteraction: '2026-04-10' },
  { id: '2', nom: 'Kasongo Jean', email: 'jean@restaurant.cd', telephone: '+243 99X XXX XXX', entreprise: 'Restaurant Le Gout', service: 'Gestion Réseaux', statut: 'En cours', valeur: 200, dateAjout: '2026-02-20', derniereInteraction: '2026-04-12' },
  { id: '3', nom: 'Tshala Grace', email: 'grace@salon.cd', telephone: '+243 97X XXX XXX', entreprise: 'Salon Grace Beauty', service: 'Logo + Branding', statut: 'Prospect', valeur: 150, dateAjout: '2026-03-05', derniereInteraction: '2026-04-11' },
]

export default function CRMDashboard() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [search, setSearch] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState<Partial<Client>>({})

  const clientsFiltres = useMemo(() => {
    return clients.filter(c =>
      (c.nom.toLowerCase().includes(search.toLowerCase()) || c.entreprise.toLowerCase().includes(search.toLowerCase())) &&
      (filtreStatut === 'Tous' || c.statut === filtreStatut)
    )
  }, [clients, search, filtreStatut])

  const stats = useMemo(() => {
    const totalCA = clients.filter(c => c.statut === 'Client').reduce((sum, c) => sum + c.valeur, 0)
    const prospects = clients.filter(c => c.statut === 'Prospect').length
    const enCours = clients.filter(c => c.statut === 'En cours').length
    const tauxConversion = clients.length > 0? ((clients.filter(c => c.statut === 'Client').length / clients.length) * 100).toFixed(0) : 0
    return { totalCA, prospects, enCours, tauxConversion }
  }, [clients])

  const dataGraphique = useMemo(() => {
    return services.map(s => ({
      name: s,
      valeur: clients.filter(c => c.service === s && c.statut === 'Client').reduce((sum, c) => sum + c.valeur, 0)
    }))
  }, [clients])

  const dataPie = [
    { name: 'Client', value: clients.filter(c => c.statut === 'Client').length, color: '#10b981' },
    { name: 'En cours', value: clients.filter(c => c.statut === 'En cours').length, color: '#3b82f6' },
    { name: 'Prospect', value: clients.filter(c => c.statut === 'Prospect').length, color: '#f59e0b' },
    { name: 'Perdu', value: clients.filter(c => c.statut === 'Perdu').length, color: '#ef4444' },
  ]

  const ajouterClient = () => {
    if (!newClient.nom ||!newClient.email) return
    const client: Client = {
      id: Date.now().toString(),
      nom: newClient.nom || '',
      email: newClient.email || '',
      telephone: newClient.telephone || '',
      entreprise: newClient.entreprise || '',
      service: newClient.service || 'Site Web',
      statut: 'Prospect',
      valeur: newClient.valeur || 0,
      dateAjout: new Date().toISOString().split('T')[0],
      derniereInteraction: new Date().toISOString().split('T')[0]
    }
    setClients([...clients, client])
    setNewClient({})
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">DK Web Studio CRM</h1>
            <p className="text-gray-400">Gère tous tes clients au même endroit</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
            <Plus size={18} /> Nouveau Client
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<DollarSign className="text-green-500"/>} titre="CA Total" valeur={`$${stats.totalCA}`} />
          <StatCard icon={<Users className="text-blue-500"/>} titre="Clients Actifs" valeur={clients.filter(c => c.statut === 'Client').length} />
          <StatCard icon={<Clock className="text-yellow-500"/>} titre="En Cours" valeur={stats.enCours} />
          <StatCard icon={<TrendingUp className="text-purple-500"/>} titre="Conversion" valeur={`${stats.tauxConversion}%`} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111] p-4 rounded-xl border-gray-800">
            <h3 className="font-semibold mb-4">CA par Service</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataGraphique}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{backgroundColor: '#222', border: 'none'}} />
                <Bar dataKey="valeur" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-[#111] p-4 rounded-xl border-gray-800">
            <h3 className="font-semibold mb-4">Répartition Clients</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                  {dataPie.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#222', border: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111] rounded-xl border-gray-800">
          <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-500" size={18} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Recher client..." className="w-full bg-[#1a1a1a] border-gray-700 rounded-lg pl-10 pr-4 py-2" />
            </div>
            <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)} className="bg-[#1a1a1a] border-gray-700 rounded-lg px-4 py-2">
              <option>Tous</option>
              {statuts.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="p-4 text-left">Client</th>
                  <th className="p-4 text-left">Service</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-left">Valeur</th>
                  <th className="p-4 text-left">Dernière Interaction</th>
                </tr>
              </thead>
              <tbody>
                {clientsFiltres.map(client => (
                  <tr key={client.id} className="border-t border-gray-800 hover:bg-[#1a1a1a]">
                    <td className="p-4">
                      <div className="font-semibold">{client.nom}</div>
                      <div className="text-gray-400 text-xs">{client.entreprise}</div>
                    </td>
                    <td className="p-4">{client.service}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.statut === 'Client'? 'bg-green-900 text-green-400' :
                        client.statut === 'En cours'? 'bg-blue-900 text-blue-400' :
                        client.statut === 'Prospect'? 'bg-yellow-900 text-yellow-400' : 'bg-red-900 text-red-400'
                      }`}>{client.statut}</span>
                    </td>
                    <td className="p-4 font-semibold">${client.valeur}</td>
                    <td className="p-4 text-gray-400">{client.derniereInteraction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div initial={{scale: 0.9}} animate={{scale: 1}} className="bg-[#111] border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Nouveau Client</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <div className="space-y-4">
              <input placeholder="Nom complet" onChange={(e) => setNewClient({...newClient, nom: e.target.value})} className="w-full bg-[#1a1a1a] border-gray-700 rounded-lg px-4 py-2" />
              <input placeholder="Email" onChange={(e) => setNewClient({...newClient, email: e.target.value})} className="w-full bg-[#1a1a1a] border-gray-700 rounded-lg px-4 py-2" />
              <input placeholder="Téléphone" onChange={(e) => setNewClient({...newClient, telephone: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2" />
              <input placeholder="Entreprise" onChange={(e) => setNewClient({...newClient, entreprise: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2" />
              <select onChange={(e) => setNewClient({...newClient, service: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2">
                {services.map(s => <option key={s}>{s}</option>)}
              </select>
              <input type="number" placeholder="Valeur estimée $" onChange={(e) => setNewClient({...newClient, valeur: Number(e.target.value)})} className="w-full bg-[#1a1a1a] border-gray-700 rounded-lg px-4 py-2" />
            </div>
            <button onClick={ajouterClient} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold">Ajouter</button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, titre, valeur }: {icon: any, titre: string, valeur: any}) {
  return (
    <div className="bg-[#111] p-4 rounded-xl border border-gray-800">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-gray-400 text-sm">{titre}</p>
      </div>
      <p className="text-2xl font-bold">{valeur}</p>
    </div>
  )
}
