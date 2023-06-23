import { EntityRepository, Repository } from 'typeorm';
import { Condidate } from 'src/models/user.entity';
interface IContact {
    email: string
    first_name:string
}
@EntityRepository(Condidate)
export class ContactRepository extends Repository<Condidate> {
  async saveContact(data) {
    const candidate= new Condidate()
    candidate.email = data.email;
    candidate.first_name = data.first_name;
    candidate.last_name = data.last_name;
    candidate.contact_number = data.contact_number;
    candidate.address = data.address;
    candidate.avatar = data.avatar;
    candidate.candidate_dob = data.candidate_dob;
    candidate.created_on = new Date().toISOString();
    candidate.updated_on = new Date().toISOString();
    candidate.gender = data.gender;
    candidate.specialization = data.specialization;
    candidate.skill = data.skill;
    candidate.resume = data.resume;
    candidate.work_ex_year = data.work_ex_year;
    try {
        return await candidate.save()
    } catch (error) {
        return error;
    }
  }
}