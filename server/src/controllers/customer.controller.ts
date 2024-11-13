import { Request, Response } from 'express';
import { Customer } from '../models/customer.model';


const customerController = {
  async addCustomer(req: Request, res: Response) {
    try {
      const customer = new Customer(req.body);
      await customer.save();
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getCustomers(req: Request, res: Response) {
    try {
      const customer = await Customer.find();
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  
  async getCustomerById(req: Request, res: Response) {
    try {
      const customer = await Customer.findById(req.params.id)
        
      if (!customer) return res.status(404).json({ message: 'customer not found' });
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateCustomer(req: Request, res: Response) {
    try {
      const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
       
      if (!customer) return res.status(404).json({ message: 'customer not found' });
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteCustomer(req: Request, res: Response) {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      if (!customer) return res.status(404).json({ message: 'customer not found' });
      res.status(200).json({ message: 'customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default customerController;
